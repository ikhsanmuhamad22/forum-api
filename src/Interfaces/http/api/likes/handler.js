const LikeAndUnlikeUseCase = require('../../../../Applications/use_case/LikeAndUnlikeUseCase');

class LikeHandler {
  constructor(container) {
    this._container = container;

    this.likeAndUnlikeHandler = this.likeAndUnlikeHandler.bind(this);
  }

  async likeAndUnlikeHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const likeAndUnlikeUseCase = this._container.getInstance(LikeAndUnlikeUseCase.name);
    await likeAndUnlikeUseCase.execute(request.params, credentialId);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = LikeHandler;
