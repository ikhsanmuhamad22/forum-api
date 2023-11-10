/* eslint-disable no-param-reassign */
class GetThreadAndHisCommentUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyAvailableThread(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    const getComments = await this._commentRepository.getCommentByThreadId(threadId);
    const comments = await this._undisplayDeleteComment(getComments);
    const result = { ...thread, comments };
    return result;
  }

  async _undisplayDeleteComment(getComments) {
    const updatedComments = await Promise.all(getComments.map(async (comment) => {
      const likeCount = await this._likeRepository.getLikeCount(comment.id);
      const getReplies = await this._replyRepository.getReplyByCommentId(comment.id);
      const replies = this._undisplayDeleteReplies(getReplies);
      if (comment.isDelete) {
        return {
          id: comment.id,
          username: comment.username,
          date: comment.date,
          content: '**komentar telah dihapus**',
        };
      }
      return {
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: comment.content,
        likeCount,
        replies,
      };
    }));

    return updatedComments;
  }

  _undisplayDeleteReplies(getReplies) {
    const updateReplies = getReplies.map((reply) => {
      if (reply.isDelete) {
        return {
          id: reply.id,
          content: '**balasan telah dihapus**',
          date: reply.date,
          username: reply.username,
        };
      }
      return {
        id: reply.id,
        content: reply.content,
        date: reply.date,
        username: reply.username,
      };
    });

    return updateReplies;
  }
}

module.exports = GetThreadAndHisCommentUseCase;
