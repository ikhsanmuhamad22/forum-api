class CommentRepository {
  async addComment(newComment, credentialId) {
    throw new Error('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getThreadById(threadId) {
    throw new Error('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyAvailableComment(id) {
    throw new Error('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = CommentRepository;
