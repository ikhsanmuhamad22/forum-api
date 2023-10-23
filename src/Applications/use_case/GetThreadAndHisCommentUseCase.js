/* eslint-disable no-param-reassign */
class GetThreadAndHisCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyAvailableThread(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    const getComments = await this._commentRepository.getCommentByThreadId(threadId);
    const comments = this._undisplayDeleteComment(getComments);
    const result = { ...thread, comments };
    return result;
  }

  _undisplayDeleteComment(getComments) {
    function updateDeletedContent(comment) {
      if (comment.isDelete) {
        comment.content = '**komentar telah dihapus**';
      }
    }

    getComments.forEach(updateDeletedContent);
    const filteredComments = getComments.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.content,
    }));
    return filteredComments;
  }
}

module.exports = GetThreadAndHisCommentUseCase;
