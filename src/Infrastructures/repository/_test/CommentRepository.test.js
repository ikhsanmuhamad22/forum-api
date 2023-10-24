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
    const threadId = 'thread-1234';
    const credentialId = 'user-123';
    await ThreadsTableTestHelper.addThread(threadId, credentialId);
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
      const newAddedcomments = await commentRepositoryPostgres.addComment(newComment, credentialId);
      const comment = await CommentsTableTestHelper.findCommentById('comment-1234');
      // Assert

      expect(comment).toHaveLength(1);
      expect(newAddedcomments).toStrictEqual(new AddedComment({
        id: 'comment-1234',
        content: 'selamat pagi',
        owner: 'user-123',
      }));
    });
  });

  describe('getCommentByThreadId function', () => {
    it('should persist get comment by thread id and return value correctly', async () => {
      // Arrange
      const threadId = 'thread-1234';
      const newComment = { content: 'selamat pagi', threadId: 'thread-1234' };

      await CommentsTableTestHelper.addComment(newComment, 'user-123');
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comment = await commentRepositoryPostgres.getCommentByThreadId(threadId);
      // Assert

      expect(comment).toHaveLength(1);
      expect(comment).toStrictEqual([{
        id: 'comment-1234',
        username: 'dicoding',
        date: '2023',
        content: 'selamat pagi',
        isDelete: true,
      }]);
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
      // adding comment
      const newComment = { content: 'selamat pagi', threadId: 'thread-1234' };
      await CommentsTableTestHelper.addComment(newComment, 'user-123');

      const commentId = 'comment-1234';
      const credentialId = 'user-123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, credentialId))
        .resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('verifyAvailableComment function', () => {
    it('should throw NotFoundError when commentId not available', async () => {
      // Arrange
      // adding comment
      const newComment = { content: 'selamat pagi', threadId: 'thread-1234' };
      await CommentsTableTestHelper.addComment(newComment, 'user-123');

      const commentId = 'comment-123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyAvailableComment(commentId))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when commentId available', async () => {
      // Arrange
      // adding comment
      const newComment = { content: 'selamat pagi', threadId: 'thread-1234' };
      await CommentsTableTestHelper.addComment(newComment, 'user-123');

      const commentId = 'comment-1234';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyAvailableComment(commentId))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('deleteCommentById function', () => {
    it('should persist deleteCommentById', async () => {
      // Arrange
      // adding comment
      const newComment = { content: 'selamat pagi', threadId: 'thread-1234' };
      await CommentsTableTestHelper.addComment(newComment, 'user-123');

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
