const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread, owner) {
    const { title, body } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const createdAt = new Date();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, owner, title, body, createdAt],
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async getThreadById(id) {
    const queryThread = {
      text: 'SELECT threads.id, threads.title, threads.body, threads.date, users.username FROM threads INNER JOIN users ON users.id = threads.owner WHERE threads.id = $1',
      values: [id],
    };

    const queryComment = {
      text: 'SELECT comments.id, users.username, comments.date, comments.content FROM comments  INNER JOIN users ON users.id = comments.owner INNER JOIN threads ON comments."threadId" = threads.id WHERE threads.id = $1',
      values: [id],
    };

    const thread = await this._pool.query(queryThread);
    const comments = await this._pool.query(queryComment);
    const result = {
      ...thread.rows[0],
      comments: [...comments.rows],
    };
    return result;
  }

  async verifyAvailableThread(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }
}

module.exports = ThreadRepositoryPostgres;
