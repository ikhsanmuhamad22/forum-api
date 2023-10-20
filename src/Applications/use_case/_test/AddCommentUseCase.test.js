const NewComment = require('../../../Domains/comments/entities/NewComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AddCommentUseCase = require('../AddCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddCommentUseCase', () => {
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

    const mockNewThread = new NewComment(useCasePayload, useCaseParams);

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve(useCaseParams.threadId));
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockNewThread, credentialId));

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      ThreadRepository: mockThreadRepository,
      CommentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await addCommentUseCase
      .execute(useCasePayload, useCaseParams, credentialId);

    // Assert
    expect(addedComment).toStrictEqual(new AddedComment({
      id: useCaseParams.threadId,
      content: useCasePayload.title,
      owner: credentialId,
    }));

    expect(mockThreadRepository.addThread).toBeCalledWith(new NewComment({
      title: useCasePayload.title,
      body: useCasePayload.body,
    }, credentialId));
  });
});
