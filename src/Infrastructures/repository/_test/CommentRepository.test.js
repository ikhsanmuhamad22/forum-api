const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    // add User owner Thread
    await UsersTableTestHelper.addUser({ username: 'dicoding' });

    // addThread
    await ThreadsTableTestHelper.addThread('thread-1234', 'user-123');
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add new comment and return value correctly', async () => {
      // Arrange
      const newComment = new NewComment(
        { content: 'selamat pagi' },
        { threadId: 'thread-1234' },
      );
      const credentialId = 'user-123';
      const fakeIdGenerator = () => 1234;
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const comments = await commentRepositoryPostgres.addComment(newComment, credentialId);

      // Assert
      expect(comments).toEqual(new AddedComment({
        id: 'comment-1234',
        content: 'selamat pagi',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyAvailableComment function', () => {
    it('should throw NotFoundError when commentId not available', async () => {
      // Arrange
      const commentId = 'comment-123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyAvailableComment(commentId))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when commentId available', async () => {
      // Arrange

      // add comment
      const newComment = { content: 'hi', threadId: 'thread-1234' };
      const credentialId = 'user-123';
      await CommentsTableTestHelper.addComment(newComment, credentialId);

      const commentId = 'comment-1234';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyAvailableComment(commentId))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when not Comment owner', async () => {
      // Arrange

      // addComment
      const newComment = { content: 'hi', threadId: 'thread-1234' };
      const credentialId = 'user-123';
      await CommentsTableTestHelper.addComment(newComment, credentialId);

      const commentId = 'comment-1234';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, 'not_comment_owner'))
        .rejects.toThrow(AuthorizationError);
    });

    it('should not throw AuthorizationError when it is Comment owner', async () => {
      // Arrange

      // addComment
      const newComment = { content: 'hi', threadId: 'thread-1234' };
      const credentialId = 'user-123';
      await CommentsTableTestHelper.addComment(newComment, credentialId);

      const commentId = 'comment-1234';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, credentialId))
        .resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteCommentById function', () => {
    it('should persist deleteCommentById', async () => {
      // Arrange

      // addComment
      const newComment = { content: 'hi', threadId: 'thread-1234' };
      const credentialId = 'user-123';
      await CommentsTableTestHelper.addComment(newComment, credentialId);

      const commentId = 'comment-1234';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteCommentById(commentId);
      const comment = await CommentsTableTestHelper.findCommentById(commentId);

      // Assert
      expect(comment[0].isDelete).toEqual(true);
    });
  });

  describe('getCommentByThreadId function', () => {
    it('should persist getReplyByCommentId', async () => {
      // Arrange

      // addComment
      const newComment = { content: 'hi', threadId: 'thread-1234' };
      const credentialId = 'user-123';
      await CommentsTableTestHelper.addComment(newComment, credentialId);

      const commentId = 'comment-1234';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comment = await commentRepositoryPostgres.getCommentByThreadId('thread-1234');

      // Assert
      expect(comment).toStrictEqual([
        {
          id: 'comment-1234',
          username: 'dicoding',
          date: '2023',
          content: 'hi',
          isDelete: false,
        },
      ]);
    });
  });
});
