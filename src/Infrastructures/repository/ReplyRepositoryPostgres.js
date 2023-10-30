const ReplyRepository = require('../../Domains/replies/ReplyRepository');

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
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, owner, commentId, content, createdAt, isDelete],
    };

    await this._pool.query(query);
  }
}

module.exports = ReplyRepositoryPostgres;
