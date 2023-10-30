const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');

class ReplyHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const likeAndUnlikeUseCase = this._container.getInstance(AddReplyUseCase.name);
    await likeAndUnlikeUseCase.execute(request.payload, request.params, credentialId);

    const response = h.response({
      status: 'success',
    });
    response.code(201);
    return response;
  }
}

module.exports = ReplyHandler;
