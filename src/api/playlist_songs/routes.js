const routes = (handler) => [
    {
      method: 'POST',
      path: '/playlists/{playlistId}/songs',
      handler: handler.postPlaylist_songHandler,
      options: {
      auth: 'openmusicapp_jwt',
    },
    },
    {
      method: 'GET',
      path: '/playlists/{playlistId}/songs',
      handler: handler.getPlaylist_songsHandler,
  options: {
      auth: 'openmusicapp_jwt',
    },
    },
    {
      method: 'DELETE',
      path: '/playlists/{playlistId}/songs',
      handler: handler.deletePlaylist_songByIdHandler,
  options: {
      auth: 'openmusicapp_jwt',
    },
    },
  ];
 
  module.exports = routes;
