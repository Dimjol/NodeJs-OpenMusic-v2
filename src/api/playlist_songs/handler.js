const ClientError = require('../../exceptions/ClientError');
 
class Playlist_songsHandler {
  constructor(playlist_songsService, playlistsService, validator) {
    this._playlist_songsService = playlist_songsService;
    this._playlistsService = playlistsService;
    this._validator = validator;
 
 
    this.postPlaylist_songHandler = this.postPlaylist_songHandler.bind(this);
    this.getPlaylist_songsHandler = this.getPlaylist_songsHandler.bind(this);
    this.deletePlaylist_songByIdHandler = this.deletePlaylist_songByIdHandler.bind(this);
  }
 
  async postPlaylist_songHandler(request, h) {
    this._validator.validatePlaylist_songPayload(request.payload);
    const { playlistId } = request.params
 
    const {songId} = request.payload
    const {id: userId} = request.auth.credentials   
    await this._playlist_songsService.verifySong(songId)
    await this._playlistsService.verifyPlaylistAccess(playlistId,userId)
    const playlist_songId = await this._playlist_songsService.addPlaylist_song({playlistId, songId})
 
    const response = h.response({
      status: 'success',
      message: 'Playlist_song berhasil ditambahkan',
      data: {
       playlist_songId,
      },
    });
    response.code(201);
    return response;
  }
 
  async getPlaylist_songsHandler(request,h) {
    // const {songId} = request.payload
 
    const {id: userId} = request.auth.credentials
    const {playlistId} = request.params
    await this._playlistsService.verifyPlaylistAccess(playlistId,userId)
 
    const playlist = await this._playlist_songsService.getPlaylist_songs(playlistId);
 
    return {
      status: 'success',
      data: {
        playlist
      }
    };
  }
 
 
async deletePlaylist_songByIdHandler(request, h) {
 
  const { playlistId } = request.params;
  const {id: userId} = request.auth.credentials
  const {songId} = request.payload
 
  this._validator.validatePlaylist_songPayload(request.payload);
  await this._playlistsService.verifyPlaylistAccess(playlistId,userId)
 
  await this._playlist_songsService.deletePlaylist_songById(playlistId, songId);
  return {
      status: 'success',
      message: 'Playlist_song berhasil dihapus',
    };
}
}
 
 
module.exports = Playlist_songsHandler;
