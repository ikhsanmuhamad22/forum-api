const NewThread = require('../../../Domains/threads/entities/NewThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should throw error if use case paramater not countain credentialId', async () => {
    // Arrange
    const newThread = { title: 'title', body: 'body' };
    const addThreadUseCase = new AddThreadUseCase({});

    // Action & Assert
    await expect(addThreadUseCase.execute(newThread)).rejects.toThrowError('NEW_THREAD_USE_CASE.NOT_CONTAIN_CREDENTIAL_ID');
  });

  it('should throw error if credentialId not string', async () => {
    // Arrange
    const newThread = { title: 'title', body: 'body' };
    const addThreadUseCase = new AddThreadUseCase({});
    const credentialId = 1234;

    // Action & Assert
    await expect(addThreadUseCase.execute(newThread, credentialId)).rejects.toThrowError('NEW_THREAD_USE_CASE.CREDENTIAL_ID_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'hello',
      body: 'selamat siang',
    };

    const mockNewThread = new NewThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
    });

    const credentialId = 'user-123';

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockNewThread));

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload, credentialId);

    // Assert
    expect(addedThread).toEqual(new NewThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
    }));

    expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
    }), credentialId);
  });
});
