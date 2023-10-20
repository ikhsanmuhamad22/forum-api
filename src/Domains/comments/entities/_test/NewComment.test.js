const NewComment = require('../NewComment');

describe('a NewComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'abc',
    };
    const params = {
      content: 'abc',
    };

    // Action and Assert
    expect(() => new NewComment(payload, params)).toThrowError('NEW_COMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
    };
    const params = {
      threadId: true,
    };

    // Action and Assert
    expect(() => new NewComment(payload, params)).toThrowError('NEW_COMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'dicoding',
    };
    const params = {
      threadId: 'thread-123',
    };

    // Action
    const { content, threadId } = new NewComment(payload, params);

    // Assert
    expect(content).toEqual(payload.content);
    expect(threadId).toEqual(params.threadId);
  });
});
