const CommentRepository = require('../../Domains/comments/CommentRepository');
const NewComment = require('../../Domains/comments/entities/NewComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment, userId) {
    const { content, threadId } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const createdAt = new Date().toString();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING content',
      values: [id, userId, threadId, content, createdAt],
    };

    const result = await this._pool.query(query);

    return new NewComment({ ...result.rows[0] });
  }
}

module.exports = CommentRepositoryPostgres;
