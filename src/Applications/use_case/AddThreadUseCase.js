const NewThread = require('../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this.threadRepository = threadRepository;
  }

  async execute(useCasePayload, credentialId) {
    const newThread = new NewThread(useCasePayload);
    this._verifyCredentialId(credentialId);
    return this.threadRepository.addThread(newThread, credentialId);
  }

  _verifyCredentialId(credentialId) {
    if (!credentialId) {
      throw new Error('NEW_THREAD_USE_CASE.NOT_CONTAIN_CREDENTIAL_ID');
    }

    if (typeof credentialId !== 'string') {
      throw new Error('NEW_THREAD_USE_CASE.CREDENTIAL_ID_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddThreadUseCase;
