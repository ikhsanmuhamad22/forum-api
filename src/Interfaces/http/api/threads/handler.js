const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const AddUserUseCase = require('../../../../Applications/use_case/AddUserUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/getThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(request.payload, credentialId);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request, h) {
    const { threadId } = request.params;
    const getThreadUseCase = this._container.getInstance(AddUserUseCase.name);

    const thread = await getThreadUseCase.execute(threadId);

    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = ThreadsHandler;
