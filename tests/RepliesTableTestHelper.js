/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHandler = {
  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const { rows } = await pool.query(query);

    return rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },

  async addReply(newReply, owner) {
    const { content, commentId } = newReply;
    const id = 'reply-1234';
    const date = '2023';
    const isDelete = false;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, owner, commentId, content, date, isDelete],
    };

    await pool.query(query);
  },
};

module.exports = RepliesTableTestHandler;
