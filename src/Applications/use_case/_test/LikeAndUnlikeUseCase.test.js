const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const LikeAndUnlikeUseCase = require('../LikeAndUnlikeUseCase');
const NewLike = require('../../../Domains/likes/entities/NewLike');

describe('LikeAndUnlikeUseCase', () => {
  it('should throw error if use case paramater not countain credentialId', async () => {
    // Arrange
    const paramsComment = { threadId: 'thread-123', commentId: 'comment-123' };
    const likeAndUnlikeUseCase = new LikeAndUnlikeUseCase({});

    // Action & Assert
    await expect(likeAndUnlikeUseCase.execute(paramsComment)).rejects.toThrowError('LIKE_USE_CASE.NOT_CONTAIN_CREDENTIAL_ID');
  });

  it('should throw error if credentialId not string', async () => {
    // Arrange
    const paramsComment = { threadId: true, commentId: 'comment-123' };
    const credentialId = 1234;
    const likeAndUnlikeUseCase = new LikeAndUnlikeUseCase({});

    // Action & Assert
    await expect(likeAndUnlikeUseCase.execute(paramsComment, credentialId)).rejects.toThrowError('LIKE_USE_CASE.CREDENTIAL_ID_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the like action correctly', async () => {
    // Arrange
    const useCaseParams = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const credentialId = 'user-123';

    const mockNewLike = new NewLike(useCaseParams);

    /** creating dependency of use case */
    const mockLikeRepository = new LikeRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.getLikeByCommentIdAndUserId = jest.fn()
      .mockImplementation(() => Promise.resolve('like'));
    mockLikeRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const likeAndUnlikeUseCase = new LikeAndUnlikeUseCase({
      likeRepository: mockLikeRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await likeAndUnlikeUseCase.execute(useCaseParams, credentialId);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCaseParams.threadId);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(useCaseParams.commentId);
    expect(mockLikeRepository.getLikeByCommentIdAndUserId)
      .toBeCalledWith(useCaseParams.commentId, credentialId);
    expect(mockLikeRepository.addLike)
      .toBeCalledWith(mockNewLike, credentialId);
  });
  it('should orchestrating the unlike action correctly', async () => {
    // Arrange
    const useCaseParams = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const credentialId = 'user-123';

    const mockNewLike = new NewLike(useCaseParams);

    /** creating dependency of use case */
    const mockLikeRepository = new LikeRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.getLikeByCommentIdAndUserId = jest.fn()
      .mockImplementation(() => Promise.resolve('unlike'));
    mockLikeRepository.deleteLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const likeAndUnlikeUseCase = new LikeAndUnlikeUseCase({
      likeRepository: mockLikeRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await likeAndUnlikeUseCase.execute(useCaseParams, credentialId);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCaseParams.threadId);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(useCaseParams.commentId);
    expect(mockLikeRepository.getLikeByCommentIdAndUserId)
      .toBeCalledWith(useCaseParams.commentId, credentialId);
    expect(mockLikeRepository.deleteLike)
      .toBeCalledWith(useCaseParams.commentId, credentialId);
  });
});
