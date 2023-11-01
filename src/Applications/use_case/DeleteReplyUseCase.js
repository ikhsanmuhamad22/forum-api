class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(id, credentialId) {
    this._verifyCredentialId(credentialId);
    console.log(id);
    await this._replyRepository.verifyAvailableReply(id);
    await this._replyRepository.verifyReplyOwner(id, credentialId);
    return this._replyRepository.deleteReplyById(id);
  }

  _verifyCredentialId(credentialId) {
    if (!credentialId) {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_CONTAIN_CREDENTIAL_ID');
    }

    if (typeof credentialId !== 'string') {
      throw new Error('DELETE_REPLY_USE_CASE.CREDENTIAL_ID_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteReplyUseCase;
