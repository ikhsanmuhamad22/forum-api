const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const RepliesTableTestHandler = require('../../../../tests/RepliesTableTestHelper');
const NewLike = require('../../../Domains/likes/entities/NewLike');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const LikeTableTestHelper = require('../../../../tests/LikesTableTestHelper');

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

  describe('addLike function', () => {
    it('should persist add new like and return value correctly', async () => {
      // Arrange
      const newReply = new NewLike(
        {
          threadId: 'thread-1234',
          commentId: 'comment-1234',
        },
      );
      const credentialId = 'user-123';
      const fakeIdGenerator = () => 1234;
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await likeRepositoryPostgres.addLike(newReply, credentialId);

      // Assert
      const like = await LikeTableTestHelper.findLikeById('like-1234');
      expect(like).toStrictEqual({
        id: 'like-1234',
        userId: 'user-123',
        commentId: 'comment-1234',
      });
    });
  });

  describe('deleteReplyById function', () => {
    it('should persist deleteReplyById', async () => {
      // Arrange

      // add like
      const newLike = { commentId: 'comment-1234' };
      const credentialId = 'user-123';
      await LikeTableTestHelper.addLike(newLike, credentialId);

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      await likeRepositoryPostgres.deleteLike(newLike.commentId, credentialId);
      const like = await LikeTableTestHelper.findLikeById('like-1234');

      // Assert
      expect(like).toStrictEqual(undefined);
    });
  });

  describe('getLikeByCommentIdAndUserId function', () => {
    it('should persist getReplyByCommentId response like', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const like = await likeRepositoryPostgres.getLikeByCommentIdAndUserId('comment-1234', 'user-123');

      // Assert
      expect(like).toStrictEqual('like');
    });

    it('should persist getReplyByCommentId response unlike', async () => {
      // Arrange

      // add like
      const newLike = { commentId: 'comment-1234' };
      const credentialId = 'user-123';
      await LikeTableTestHelper.addLike(newLike, credentialId);

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const like = await likeRepositoryPostgres.getLikeByCommentIdAndUserId('comment-1234', credentialId);

      // Assert
      expect(like).toStrictEqual('unlike');
    });
  });

  describe('getLikeCount function', () => {
    it('should persist getLikeCount', async () => {
      // Arrange

      // add like
      const newLike = { commentId: 'comment-1234' };
      const credentialId = 'user-123';
      await LikeTableTestHelper.addLike(newLike, credentialId);

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const like = await likeRepositoryPostgres.getLikeCount(newLike.commentId);

      // Assert
      expect(like).toStrictEqual(1);
    });
  });
});
