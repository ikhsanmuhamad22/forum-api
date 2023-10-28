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
  beforeAll(async () => {
    // add User owner Thread
    await UsersTableTestHelper.addUser({ username: 'dicoding' });

    // addThread
    const threadId = 'thread-1234';
    const credentialId = 'user-123';
    await ThreadsTableTestHelper.addThread(threadId, credentialId);
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
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
      const commentId = 'comment-1234';
      const credentialId = 'not_user_owner';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, credentialId))
        .rejects.toThrow(AuthorizationError);
    });

    it('should not throw AuthorizationError when it is Comment owner', async () => {
      // Arrange
      const commentId = 'comment-1234';
      const credentialId = 'user-123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, credentialId))
        .resolves.not.toThrow(AuthorizationError);
    });
  });
  describe('deleteCommentById function', () => {
    it('should persist deleteCommentById', async () => {
      // Arrange
      const commentId = 'comment-1234';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteCommentById(commentId);
      const comment = await CommentsTableTestHelper.findCommentById(commentId);

      // Assert
      expect(comment[0].isDelete).toEqual(true);
    });
  });
});
