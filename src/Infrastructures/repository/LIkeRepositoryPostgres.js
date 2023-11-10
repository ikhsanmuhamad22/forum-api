/* eslint-disable import/no-unresolved */
const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(newLike, userId) {
    const { commentId } = newLike;
    const id = `like-${this._idGenerator()}`;
    const createdAt = new Date();

    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3, $4)',
      values: [id, userId, commentId, createdAt],
    };

    await this._pool.query(query);
  }

  async deleteLike(commentId, userId) {
    const query = {
      text: 'DELETE FROM likes WHERE "commentId" = $1 and "userId" = $2',
      values: [commentId, userId],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getLikeByCommentIdAndUserId(commentId, userId) {
    const query = {
      text: 'SELECT * FROM likes WHERE "commentId" = $1 and "userId" = $2',
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return 'like';
    }
    return 'unlike';
  }

  async getLikeCount(commentId) {
    const query = {
      text: 'SELECT * FROM likes WHERE "commentId" = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rowCount;
  }
}

module.exports = LikeRepositoryPostgres;
