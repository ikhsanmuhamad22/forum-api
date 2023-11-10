/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikeTableTestHelper = {
  async findLikeById(id) {
    const query = {
      text: 'SELECT id, "userId", "commentId" FROM likes WHERE id = $1',
      values: [id],
    };

    const { rows } = await pool.query(query);

    return rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },

  async addLike(newLike, userId) {
    const { commentId } = newLike;
    const id = 'like-1234';
    const date = '2023';

    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3, $4)',
      values: [id, userId, commentId, date],
    };

    await pool.query(query);
  },
};

module.exports = LikeTableTestHelper;
