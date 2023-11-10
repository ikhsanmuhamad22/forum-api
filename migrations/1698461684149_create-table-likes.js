exports.up = (pgm) => {
  pgm.createTable('likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    userId: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    commentId: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    date: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
  pgm.createConstraint('likes', 'fk_likes.userId_users.id', {
    foreignKeys: {
      columns: 'userId',
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
  });
  pgm.createConstraint('likes', 'fk_likes.commentId_comments.id', {
    foreignKeys: {
      columns: 'commentId',
      references: 'comments(id)',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('likes');
};
