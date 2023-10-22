const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadsRepositoryPostgres', () => {
  beforeEach(async () => {
    // add user
    await UsersTableTestHelper.addUser({ username: 'dicoding' });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });
  describe('ThreadRepository', () => {
    describe('addThread function', () => {
      it('should persist add new thread and return value correctly', async () => {
        // Arrange
        const newThread = new NewThread({
          title: 'ini title',
          body: 'ini body',
        });
        const threadId = 'thread-1234';
        const credentialId = 'user-123';
        const fakeIdGenerator = () => '1234';
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

        // Action
        const newAddedThread = await threadRepositoryPostgres.addThread(newThread, credentialId);
        const thread = await ThreadsTableTestHelper.findThreadById(threadId);

        // Assert
        expect(thread).toHaveLength(1);
        expect(newAddedThread).toEqual({
          id: 'thread-1234',
          title: 'ini title',
          owner: 'user-123',
        });
      });
    });
  });

  describe('verifyAvailbaleThread function', () => {
    it('should throw NotFoundError when threadId not available', async () => {
      // Arrange
      const threadId = 'threadId-fake';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres
        .verifyAvailableThread(threadId)).rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when threadId available', async () => {
      // Arrange

      // add thread
      const threadId = 'thread-1234';
      const credentialId = 'user-123';
      await ThreadsTableTestHelper.addThread(threadId, credentialId);

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread(threadId))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('getThreadById function', () => {
    it('should persist getThreadById and return value correctly', async () => {
      // Arrange

      const threadId = 'thread-1234';
      const credentialId = 'user-123';
      await ThreadsTableTestHelper.addThread(threadId, credentialId);

      // add comment for some reason
      const newComment = new NewComment(
        { content: 'selamat pagi' },
        { threadId: 'thread-1234' },
      );
      await CommentsTableTestHelper.addComment(newComment, credentialId);

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getThreadById(threadId);

      // Assert
      expect(thread).toEqual({
        id: 'thread-1234',
        title: 'selamat siang',
        body: 'apa kabar',
        date: '2023',
        username: 'dicoding',
        comments: [
          {
            id: 'comment-1234',
            username: 'dicoding',
            date: '2023',
            content: 'selamat pagi',
          },
        ],
      });
    });
  });
});
