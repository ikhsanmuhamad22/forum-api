const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment, owner) {
    const { content, threadId } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const isDelete = false;
    const date = new Date();

    const query = {
      text: 'INSERT INTO comments (id, owner, "threadId", content, date, "isDelete") VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, owner, threadId, content, date, isDelete],
    };
    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async deleteCommentById(id) {
    const deleteContent = '**komentar telah dihapus**';
    const query = {
      text: 'UPDATE comments SET "content" = $1, "isDelete" = $2 WHERE id = $3',
      values: [deleteContent, true, id],
    };
    await this._pool.query(query);
  }

  async verifyCommentOwner(id, credentialId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND comments.owner = $2',
      values: [id, credentialId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini!');
    }
  }

  async verifyAvailableComment(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }
}

module.exports = CommentRepositoryPostgres;
