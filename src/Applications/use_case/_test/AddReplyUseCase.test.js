const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should throw error if use case paramater not countain credentialId', async () => {
    // Arrange
    const useCasePayload = { content: 'pagi semuaa' };
    const useCaseParams = { threadId: 'thread-123' };
    const addCommentUseCase = new AddReplyUseCase({});

    // Action & Assert
    await expect(addCommentUseCase.execute(useCasePayload, useCaseParams)).rejects.toThrowError('ADD_REPLY_USE_CASE.NOT_CONTAIN_CREDENTIAL_ID');
  });

  it('should throw error if credentialId not string', async () => {
    // Arrange
    const useCasePayload = { content: 'pagi semuaa' };
    const useCaseParams = { threadId: 'thread-123' };
    const credentialId = 1234;
    const addThreadUseCase = new AddReplyUseCase({});

    // Action & Assert
    await expect(addThreadUseCase.execute(useCaseParams, useCasePayload, credentialId)).rejects.toThrowError('ADD_REPLY_USE_CASE.CREDENTIAL_ID_NOT_MEET_DATA_TYPE_SPECIFICATION');
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
      commentId: 'comment-123',
    };

    const credentialId = 'user-123';

    const mockNewReply = new NewReply(useCasePayload, useCaseParams);

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockNewReply));

    /** creating use case instance */
    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const addedReply = await addReplyUseCase
      .execute(useCasePayload, useCaseParams, credentialId);

    console.log(addedReply);

    // Assert
    expect(addedReply).toStrictEqual(new NewReply({
      content: useCasePayload.content,
    }, {
      threadId: useCaseParams.threadId,
      commentId: useCaseParams.commentId,
    }));

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCaseParams.threadId);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(useCaseParams.commentId);
    expect(mockReplyRepository.addReply).toBeCalledWith(new NewReply({
      content: useCasePayload.content,
    }, {
      threadId: useCaseParams.threadId,
      commentId: useCaseParams.commentId,
    }), credentialId);
  });
});
