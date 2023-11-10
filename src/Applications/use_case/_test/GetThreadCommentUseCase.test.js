/* eslint-disable import/no-unresolved */
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadAndHisCommentUseCase = require('../GetThreadAndHisCommentUseCase');

describe('GetThreadAndHisCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the get thread with comment and reply no delete action correctly', async () => {
    // Arrange
    const mockThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2023-10-23T20:05:58.560+07:00',
      username: 'dicoding',
    };
    const mockComment = [{
      id: 'comment-123',
      username: 'johndoe',
      date: '2023-10-23T20:05:59.159+07:00',
      content: 'sebuah comment a',
      isDelete: false,
    }];
    const mockReply = [{
      id: 'reply-123',
      content: 'sebuah reply a',
      date: '2023-10-23T20:05:59.159+07:00',
      username: 'johndoe',
      isDelete: false,
    }];

    const threadId = 'thread-123';

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComment));
    mockLikeRepository.getLikeCount = jest.fn()
      .mockImplementation(() => Promise.resolve(3));
    mockReplyRepository.getReplyByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockReply));

    /** creating use case instance */
    const getThreadAndHisCommentUseCase = new GetThreadAndHisCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const getThread = await getThreadAndHisCommentUseCase.execute(threadId);

    // Assert
    expect(getThread).toStrictEqual({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2023-10-23T20:05:58.560+07:00',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'johndoe',
          date: '2023-10-23T20:05:59.159+07:00',
          content: 'sebuah comment a',
          likeCount: 3,
          replies: [{
            id: 'reply-123',
            content: 'sebuah reply a',
            date: '2023-10-23T20:05:59.159+07:00',
            username: 'johndoe',
          }],
        },
      ],
    });
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(threadId);
  });

  it('should orchestrating the get thread with coment and reply delete true action correctly', async () => {
    // Arrange
    const mockThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2023-10-23T20:05:58.560+07:00',
      username: 'dicoding',
    };
    const mockComment = [
      {
        id: 'comment-123',
        username: 'johndoe',
        date: '2023-10-23T20:05:59.159+07:00',
        content: 'sebuah comment a',
        isDelete: false,
      }, {
        id: 'comment-1234',
        username: 'johndoe',
        date: '2023-10-23T20:05:59.159+07:00',
        content: 'sebuah comment a',
        isDelete: true,
      },
    ];
    const mockReply = [{
      id: 'reply-123',
      content: 'sebuah reply a',
      date: '2023-10-23T20:05:59.159+07:00',
      username: 'johndoe',
      isDelete: true,
    }];

    const threadId = 'thread-123';

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComment));
    mockLikeRepository.getLikeCount = jest.fn()
      .mockImplementation(() => Promise.resolve(3));
    mockReplyRepository.getReplyByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockReply));

    /** creating use case instance */
    const getThreadAndHisCommentUseCase = new GetThreadAndHisCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const getThread = await getThreadAndHisCommentUseCase.execute(threadId);

    // Assert
    expect(getThread).toStrictEqual({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2023-10-23T20:05:58.560+07:00',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'johndoe',
          date: '2023-10-23T20:05:59.159+07:00',
          content: 'sebuah comment a',
          likeCount: 3,
          replies: [{
            id: 'reply-123',
            content: '**balasan telah dihapus**',
            date: '2023-10-23T20:05:59.159+07:00',
            username: 'johndoe',
          }],
        },
        {
          id: 'comment-1234',
          username: 'johndoe',
          date: '2023-10-23T20:05:59.159+07:00',
          content: '**komentar telah dihapus**',
        },
      ],
    });
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(threadId);
  });
});
