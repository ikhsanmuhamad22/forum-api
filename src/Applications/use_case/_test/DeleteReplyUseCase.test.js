const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplayUseCase', () => {
  it('should throw error if use case paramater not countain credentialId', async () => {
    // Arrange
    const id = 'reply-123';
    const deleteReplyUseCase = new DeleteReplyUseCase({});

    // Action & Assert
    await expect(deleteReplyUseCase.execute(id)).rejects.toThrowError('DELETE_REPLY_USE_CASE.NOT_CONTAIN_CREDENTIAL_ID');
  });

  it('should throw error if credentialId not string', async () => {
    // Arrange
    const id = 'reply-123';
    const credentialId = 1234;
    const deleteReplyUseCase = new DeleteReplyUseCase({});

    // Action & Assert
    await expect(deleteReplyUseCase.execute(id, credentialId)).rejects.toThrowError('DELETE_REPLY_USE_CASE.CREDENTIAL_ID_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const id = 'reply-123';
    const credentialId = 'user-123';

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockReplyRepository.verifyAvailableReply = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(id, credentialId);

    // Assert
    expect(mockReplyRepository.verifyAvailableReply).toBeCalledWith(id);
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(id, credentialId);
    expect(mockReplyRepository.deleteReplyById).toBeCalledWith(id);
  });
});
