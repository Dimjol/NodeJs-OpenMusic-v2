const Playlist_songsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "playlist_songs",
  version: "1.0.0",
  register: async (server, { playlist_songsService, playlistsService, validator }) => {
    const playlist_songsHandler = new Playlist_songsHandler(playlist_songsService, playlistsService, validator);
    server.route(routes(playlist_songsHandler));
  },
};
