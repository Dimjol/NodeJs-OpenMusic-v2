const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.postPlaylistHandler,
    options: {
    auth: 'openmusicapp_jwt',
  },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: (request, h) => handler.getPlaylistsHandler(request, h),
options: {
    auth: 'openmusicapp_jwt',
  },
  },
  {
    method: 'GET',
    path: '/playlists/{id}',
    handler: handler.getPlaylistByIdHandler,
options: {
    auth: 'openmusicapp_jwt',
  },
  },
  {
    method: 'PUT',
    path: '/playlists/{id}',
    handler: handler.putPlaylistByIdHandler,
options: {
    auth: 'openmusicapp_jwt',
  },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: handler.deletePlaylistByIdHandler,
options: {
    auth: 'openmusicapp_jwt',
  },
  },
];

module.exports = routes;


