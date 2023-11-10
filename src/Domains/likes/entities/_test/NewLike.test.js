const NewLike = require('../NewLike');

describe('a NewLike entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const params = {
      threadId: 'thread-123',
    };

    // Action and Assert
    expect(() => new NewLike(params)).toThrowError('NEW_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const params = {
      threadId: true,
      commentId: 123,
    };

    // Action and Assert
    expect(() => new NewLike(params)).toThrowError('NEW_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewComment object correctly', () => {
    // Arrange
    const params = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    // Action
    const { threadId, commentId } = new NewLike(params);

    // Assert
    expect(threadId).toEqual(params.threadId);
    expect(commentId).toEqual(params.commentId);
  });
});
