const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should throw error if use case paramater not countain credentialId', async () => {
    // Arrange
    const id = 'comment-123';
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    // Action & Assert
    await expect(deleteCommentUseCase.execute(id)).rejects.toThrowError('DELETE_THREAD_USE_CASE.NOT_CONTAIN_CREDENTIAL_ID');
  });

  it('should throw error if credentialId not string', async () => {
    // Arrange
    const id = 'comment-123';
    const credentialId = 1234;
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    // Action & Assert
    await expect(deleteCommentUseCase.execute(id, credentialId)).rejects.toThrowError('DELETE_THREAD_USE_CASE.CREDENTIAL_ID_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const id = 'comment-123';
    const credentialId = 'user-123';

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.verifyAvailableComment = jest.fn()
      .mockImplementation(() => Promise.resolve(id));
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve(id, credentialId));
    mockCommentRepository.deleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(id));

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(id, credentialId);

    // Assert
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(id);
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(id, credentialId);
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(id);
  });
});
