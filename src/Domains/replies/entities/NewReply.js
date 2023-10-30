class NewReply {
  constructor(payload, params) {
    this._verifyPayload(payload, params);

    const { content } = payload;
    const { commentId } = params;

    this.content = content;
    this.threadId = commentId;
  }

  _verifyPayload({ content }, { commentId }) {
    if (!content || !commentId) {
      throw new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof commentId !== 'string') {
      throw new Error('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewReply;
