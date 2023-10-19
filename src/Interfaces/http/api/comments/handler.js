const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');

class CommentHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const NewComment = await addCommentUseCase
      .execute(request.payload, request.params, credentialId);

    const response = h.response({
      status: 'success',
      data: {
        NewComment,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = CommentHandler;
