const NewLIke = require('../../Domains/likes/entities/NewLike');

class LikeAndUnlikeUseCase {
  constructor({ likeRepository, threadRepository, commentRepository }) {
    this._likeRepository = likeRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCaseParams, credentialId) {
    const newlike = new NewLIke(useCaseParams);
    this._verifyCredentialId(credentialId);
    await this._threadRepository.verifyAvailableThread(useCaseParams.threadId);
    await this._commentRepository.verifyAvailableComment(useCaseParams.commentId);
    this.likeRepository.addLike(newlike, credentialId);
  }

  _verifyCredentialId(credentialId) {
    if (!credentialId) {
      throw new Error('LIKE_USE_CASE.NOT_CONTAIN_CREDENTIAL_ID');
    }

    if (typeof credentialId !== 'string') {
      throw new Error('LIKE_USE_CASE.CREDENTIAL_ID_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = LikeAndUnlikeUseCase;
