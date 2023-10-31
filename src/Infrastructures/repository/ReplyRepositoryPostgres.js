const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply, owner) {
    const { content, commentId } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const createdAt = new Date();
    const isDelete = false;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, owner, commentId, content, createdAt, isDelete],
    };

    const result = await this._pool.query(query);
    return new AddedReply(result.rows[0]);
  }

  async getReplyByCommentId(commentId) {
    const query = {
      text: 'SELECT replies.id, replies.content, replies.date, users.username, replies."isDelete" FROM replies INNER JOIN users ON replies.owner = users.id INNER JOIN comments ON replies."commentId" = comments.id WHERE comments.id = $1',
      values: [commentId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = ReplyRepositoryPostgres;
