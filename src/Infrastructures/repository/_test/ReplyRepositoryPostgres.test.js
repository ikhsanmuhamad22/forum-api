const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const RepliesTableTestHandler = require('../../../../tests/RepliesTableTestHelper');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  beforeEach(async () => {
    // add User owner Thread
    await UsersTableTestHelper.addUser({ username: 'dicoding' });

    // addThread
    await ThreadsTableTestHelper.addThread('thread-1234', 'user-123');

    // add comment
    await CommentsTableTestHelper.addComment({ content: 'hi', threadId: 'thread-1234' }, 'user-123');
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHandler.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist add new reply and return value correctly', async () => {
      // Arrange
      const newReply = new NewReply(
        { content: 'selamat pagi' },
        { commentId: 'comment-1234' },
      );
      const credentialId = 'user-123';
      const fakeIdGenerator = () => 1234;
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const comments = await replyRepositoryPostgres.addReply(newReply, credentialId);

      // Assert
      expect(comments).toEqual(new AddedReply({
        id: 'reply-1234',
        content: 'selamat pagi',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyAvailableReply function', () => {
    it('should throw NotFoundError when replyId not available', async () => {
      // Arrange
      const replyId = 'reply-1234';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyAvailableReply(replyId))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when replyId available', async () => {
      // Arrange

      // add reply
      const newReply = { content: 'hi', commentId: 'comment-1234' };
      const credentialId = 'user-123';
      await RepliesTableTestHandler.addReply(newReply, credentialId);

      const replyId = 'reply-1234';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(replyRepositoryPostgres.verifyAvailableReply(replyId))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw AuthorizationError when not reply owner', async () => {
      // Arrange

      // add reply
      const newReply = { content: 'hi', commentId: 'comment-1234' };
      const credentialId = 'user-123';
      await RepliesTableTestHandler.addReply(newReply, credentialId);

      const replyId = 'reply-1234';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & assert
      await expect(replyRepositoryPostgres.verifyReplyOwner(replyId, 'not_reply_owner'))
        .rejects.toThrow(AuthorizationError);
    });

    it('should not throw AuthorizationError when it is reply owner', async () => {
      // Arrange
      // add reply
      const newReply = { content: 'hi', commentId: 'comment-1234' };
      const credentialId = 'user-123';
      await RepliesTableTestHandler.addReply(newReply, credentialId);

      const replyId = 'reply-1234';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & assert
      await expect(replyRepositoryPostgres.verifyReplyOwner(replyId, credentialId))
        .resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteReplyById function', () => {
    it('should persist deleteReplyById', async () => {
      // Arrange

      // add reply
      const newReply = { content: 'hi', commentId: 'comment-1234' };
      const credentialId = 'user-123';
      await RepliesTableTestHandler.addReply(newReply, credentialId);

      const replyId = 'reply-1234';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      await replyRepositoryPostgres.deleteReplyById(replyId);
      const reply = await RepliesTableTestHandler.findReplyById(replyId);

      // Assert
      expect(reply[0].isDelete).toEqual(true);
    });
  });

  describe('getReplyByCommentId function', () => {
    it('should persist getReplyByCommentId', async () => {
      // Arrange

      // add reply
      const newReply = { content: 'hi', commentId: 'comment-1234' };
      const credentialId = 'user-123';
      await RepliesTableTestHandler.addReply(newReply, credentialId);

      const replyId = 'reply-1234';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const reply = await replyRepositoryPostgres.getReplyByCommentId('comment-1234');

      // Assert
      expect(reply).toStrictEqual([
        {
          id: 'reply-1234',
          content: 'hi',
          date: '2023',
          username: 'dicoding',
          isDelete: false,
        },
      ]);
    });
  });
});
