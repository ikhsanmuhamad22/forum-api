const NewLike = require('../../Domains/likes/entities/NewLike');

class LikeAndUnlikeUseCase {
  constructor({ likeRepository, threadRepository, commentRepository }) {
    this._likeRepository = likeRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCaseParams, credentialId) {
    this._verifyCredentialId(credentialId);
    const newlike = new NewLike(useCaseParams);
    await this._threadRepository.verifyAvailableThread(useCaseParams.threadId);
    await this._commentRepository.verifyAvailableComment(useCaseParams.commentId);
    const result = this._likeRepository
      .getLikeByCommentIdAndUserId(useCaseParams.commentId, credentialId);
    this._LikeAndUnlikeHandler(result, newlike, useCaseParams, credentialId);
  }

  _verifyCredentialId(credentialId) {
    if (!credentialId) {
      throw new Error('LIKE_USE_CASE.NOT_CONTAIN_CREDENTIAL_ID');
    }

    if (typeof credentialId !== 'string') {
      throw new Error('LIKE_USE_CASE.CREDENTIAL_ID_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  async _LikeAndUnlikeHandler(result, newLike, useCaseParams, credentialId) {
    if (await result === 'like') {
      return this._likeRepository.addLike(newLike, credentialId);
    }
    return this._likeRepository.deleteLike(useCaseParams.commentId, credentialId);
  }
}

module.exports = LikeAndUnlikeUseCase;
