class ReplyRepository {
  async addReply(newReply, credentialId) {
    console.log(newReply, credentialId);
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteReplyById(id) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyReplyOwner(id) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyAvailableReply(id) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ReplyRepository;

// NewReply {
//   content: 'sebuah balasan',
//   commentId: 'comment-snKOILnGjC4kWslVPG-0u'
// } user-l4HGefnmqc8VhGIsvkr02

// NewReply { content: 'hello pagi semua', commentId: 'comment-123' } user-123
