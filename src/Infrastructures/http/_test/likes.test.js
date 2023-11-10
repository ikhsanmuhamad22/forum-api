const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}/likes enpoints', () => {
  // create variable global
  let accessTokenUserA = '';
  let accessTokenUserB = '';
  let threadId = '';
  let commentId = '';

  beforeAll(async () => {
    /** create user and user login */
    const server = await createServer(container);

    // User A
    const createUserALoginPayload = {
      username: 'userA',
      password: 'secret',
    };

    // add user A
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'userA',
        password: 'secret',
        fullname: 'user A',
      },
    });
    // user A login
    const responseUserALogin = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: createUserALoginPayload,
    });

    const responseJsonUserALogin = JSON.parse(responseUserALogin.payload);
    const { accessToken: resultTokenUserA } = responseJsonUserALogin.data;
    accessTokenUserA = resultTokenUserA;

    // User B
    const createUserBLoginPayload = {
      username: 'userB',
      password: 'secret',
    };

    // add user B
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'userB',
        password: 'secret',
        fullname: 'user B',
      },
    });

    // user B login
    const responseUserBLogin = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: createUserBLoginPayload,
    });

    const responseJsonUserBLogin = JSON.parse(responseUserBLogin.payload);
    const { accessToken: resultTokenUserB } = responseJsonUserBLogin.data;
    accessTokenUserB = resultTokenUserB;

    // create thread
    const requestPayloadthread = {
      title: 'hello world',
      body: 'selamat pagiii',
    };

    // Action
    const responseThread = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: requestPayloadthread,
      headers: {
        Authorization: `Bearer ${accessTokenUserA}`,
      },
    });

    // set Variable threadId
    const responseJsonThread = JSON.parse(responseThread.payload);
    threadId = responseJsonThread.data.addedThread.id;

    // create comment
    const requestPayloadComment = {
      content: 'hello world',
    };

    // Action
    const response = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments`,
      payload: requestPayloadComment,
      headers: {
        Authorization: `Bearer ${accessTokenUserA}`,
      },
    });

    // set Variable threadId
    const responseJsonComment = JSON.parse(response.payload);
    commentId = responseJsonComment.data.addedComment.id;
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await pool.end();
  });

  /** PUT LIKE ENDPOINT */
  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 401 when post reply not authentication', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when threadId not available', async () => {
      // Arrange
      const fakeThreadId = 'fakeThreadId';
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${fakeThreadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessTokenUserB}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 404 when commentId not available', async () => {
      // Arrange
      const fakeCommentId = 'fakeCommentId';
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${fakeCommentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessTokenUserB}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment tidak ditemukan');
    });

    it('should response 200 when success like or unlike', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessTokenUserB}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      // Assert
      expect(response.statusCode).toEqual(200);
      expect(responseJson).toHaveProperty('status');
      expect(responseJson.status).toEqual('success');
    });
  });
});
