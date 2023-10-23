const NewComment = require('../../../Domains/comments/entities/NewComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddCommentUseCase', () => {
  it('should throw error if use case paramater not countain credentialId', async () => {
    // Arrange
    const newComment = { content: 'pagi semuaa' };
    const paramsComment = { threadId: 'thread-123' };
    const addCommentUseCase = new AddCommentUseCase({});

    // Action & Assert
    await expect(addCommentUseCase.execute(newComment, paramsComment)).rejects.toThrowError('NEW_THREAD_USE_CASE.NOT_CONTAIN_CREDENTIAL_ID');
  });

  it('should throw error if credentialId not string', async () => {
    // Arrange
    const newComment = { content: 'pagi semuaa' };
    const paramsComment = { threadId: true };
    const credentialId = 1234;
    const addThreadUseCase = new AddCommentUseCase({});

    // Action & Assert
    await expect(addThreadUseCase.execute(newComment, paramsComment, credentialId)).rejects.toThrowError('NEW_THREAD_USE_CASE.CREDENTIAL_ID_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'hello pagi semua',
    };
    const useCaseParams = {
      threadId: 'thread-123',
    };

    const credentialId = 'user-123';

    const mockNewComment = new NewComment(useCasePayload, useCaseParams);

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockNewComment));

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await addCommentUseCase
      .execute(useCasePayload, useCaseParams, credentialId);

    // Assert
    expect(addedComment).toStrictEqual(new NewComment({
      content: useCasePayload.content,
    }, {
      threadId: useCaseParams.threadId,
    }));

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCaseParams.threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment({
      content: useCasePayload.content,
    }, {
      threadId: useCaseParams.threadId,
    }), credentialId);
  });
});
