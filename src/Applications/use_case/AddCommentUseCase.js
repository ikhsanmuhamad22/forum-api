const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, useCaseParams, credentialId) {
    this._verifyCredentialId(credentialId);
    const newComment = new NewComment(useCasePayload, useCaseParams);
    this._threadRepository.verifyAvailableThread(useCaseParams.threadId);
    return this._commentRepository.addComment(newComment, credentialId);
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

module.exports = AddCommentUseCase;
