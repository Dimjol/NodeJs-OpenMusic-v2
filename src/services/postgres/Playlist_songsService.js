const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
 
class Playlist_songsService {
   constructor(collaborationService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
  }
 
  async addPlaylist_song({playlistId,songId}) {
    const id = `playlist_song-${nanoid(16)}`;
 
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId,songId],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rows[0].id) {
      throw new InvariantError('Playlist_song gagal ditambahkan');
    }
 
    return result.rows[0].id;
  }
 
  async getPlaylist_songs(playlistId) {
    const queryPlaylist = {
      text: `SELECT playlists.id, playlists.name, users.username
      FROM playlists
      JOIN users ON playlists.owner = users.id
      WHERE playlists.id = $1`,
      values: [playlistId],
    };
 
    const result = await this._pool.query(queryPlaylist);
 
    if (!result.rows.length) {
      throw new NotFoundError("Playlist_song tidak ditemukan");
    }
 
    const querySongs = {
      text: `SELECT songs.id, songs.title, songs.performer
            FROM playlist_songs
            JOIN songs ON playlist_songs.song_id = songs.id
            WHERE playlist_songs.playlist_id= $1`,
      values: [playlistId],
    };
 
    const songResult = await this._pool.query(querySongs);
 
    const songs = songResult.rows.map((song) => ({
      id: song.id,
      title: song.title,
      performer: song.performer,
    }))
 
    const playlist = {
        id: result.rows[0].id,
        name: result.rows[0].name,
        username: result.rows[0].username,
        songs: songs
    }
 
 
    return playlist;
  }
 
 
  async deletePlaylist_songById(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, songId],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rowCount) {
      throw new InvariantError('Gagal menghapus lagu dari Playlist');
    }
  }
 
  async verifySong(songId) {
    const query = {
      text: `SELECT id FROM songs WHERE id = $1`,
      values: [songId]
    }
 
    const result = await this._pool.query(query)
 
    if(!result.rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan')
    }
  }
}
 
module.exports = Playlist_songsService;
