class NewComment {
  constructor(payload, params) {
    this._verifyPayload(payload, params);

    const { content } = payload;
    const { threadId } = params;

    this.content = content;
    this.threadId = threadId;
  }

  _verifyPayload({ content }, { threadId }) {
    if (!content || !threadId) {
      throw new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof threadId !== 'string') {
      throw new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewComment;
