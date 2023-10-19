class GetThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyAvailableThread(threadId);
    const resultThread = await this._threadRepository.getThreadById(threadId);
    return resultThread;
  }
}

module.exports = GetThreadUseCase;
