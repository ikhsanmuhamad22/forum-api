const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ commentRepository, threadRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload, useCaseParams, credentialId) {
    this._verifyCredentialId(credentialId);
    await this._threadRepository.verifyAvailableThread(useCaseParams.threadId);
    await this._commentRepository.verifyAvailableComment(useCaseParams.commentId);
    const newReply = new NewReply(useCasePayload, useCaseParams);
    return this._replyRepository.addReply(newReply, credentialId);
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

module.exports = AddReplyUseCase;
