const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postUserHandler,
  },
]);

module.exports = routes;
