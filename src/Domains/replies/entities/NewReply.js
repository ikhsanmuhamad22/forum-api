class NewReply {
  constructor(payload, params) {
    this._verifyPayload(payload, params);

    const { content } = payload;
    const { threadId, commentId } = params;

    this.content = content;
    this.threadId = threadId;
    this.commentId = commentId;
  }

  _verifyPayload({ content }, { threadId, commentId }) {
    if (!content || !threadId) {
      throw new Error('NEW_COMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof threadId !== 'string' || typeof commentId !== 'string') {
      throw new Error('NEW_COMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewReply;
