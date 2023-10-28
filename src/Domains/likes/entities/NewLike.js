class NewLIke {
  constructor(params) {
    this._verifyPayload(params);

    const { threadId, commentId } = params;

    this.threadId = threadId;
    this.commentId = commentId;
  }

  _verifyPayload({ threadId, commentId }) {
    if (!commentId || !threadId) {
      throw new Error('NEW_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof commentId !== 'string' || typeof threadId !== 'string') {
      throw new Error('NEW_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewLIke;
