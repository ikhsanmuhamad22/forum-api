/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const { rows } = await pool.query(query);

    return rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },

  async addComment(newComment, owner) {
    const { content, threadId } = newComment;
    const id = 'comment-1234';
    const date = '2023';
    const isDelete = true;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, owner, threadId, content, date, isDelete],
    };

    await pool.query(query);
  },
};

module.exports = CommentsTableTestHelper;
