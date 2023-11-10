const NewReply = require('../NewReply');

describe('a NewReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'pagii yang indah di konoha ini',
    };
    const params = {
    };

    // Action and Assert
    expect(() => new NewReply(payload, params)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 'pagii yang indah di konoha ini',
    };
    const params = {
      commentId: true,
    };

    // Action and Assert
    expect(() => new NewReply(payload, params)).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewReply object correctly', () => {
    // Arrange
    const payload = {
      content: 'pagii yang indah di konoha ini',
    };
    const params = {
      commentId: 'comment-123',
    };

    // Action
    const { content, commentId } = new NewReply(payload, params);

    // Assert
    expect(content).toEqual(payload.content);
    expect(commentId).toEqual(params.commentId);
  });
});
