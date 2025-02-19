const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
 
class PlaylistsService {
   constructor(collaborationService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
  }
 
  async addPlaylist({name,owner}) {
    const id = `playlist-${nanoid(16)}`;
 
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name,owner],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }
 
    return result.rows[0].id;
  }
 
  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.id, playlists.name, playlists.owner as username FROM playlists
      LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
      WHERE playlists.owner = $1 OR collaborations.user_id = $1
      GROUP BY playlists.id`,
      values: [owner],
    };
 
    const result = await this._pool.query(query);
 
    return result.rows;
  }
 
  async getPlaylistById(id) {
    const queryPlaylist = {
      text: "SELECT id, name FROM playlists WHERE id = $1",
      values: [id],
    };
 
    const result = await this._pool.query(queryPlaylist);
 
    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }
 
    const playlist = result.rows[0];
 
    const querySongsInPlaylist = {
      text: "SELECT song_id FROM playlist_songs WHERE playlist_id = $1",
      values: [playlist.id],
    };
 
    const song = await this._pool.query(querySongsInPlaylist);
 
    const querySongs = {
      text: "SELECT id, title, performer FROM songs WHERE id = $1",
      values: [song.rows[0].song_id],
    };
 
    const songResult = await this._pool.query(querySongs);
 
    playlist.songs = songResult.rows;
 
    return playlist;
  }
 
  async editPlaylistById(id, { name,owner }) {
    const query = {
      text: 'UPDATE playlists SET name = $1, owner = $2, WHERE id = $3 RETURNING id',
      values: [id,name,owner],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui Playlist. Id tidak ditemukan');
    }
  }
 
  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }
  async verifyPlaylistOwner(id,owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new NotFoundError('Resource yang Anda minta tidak ditemukan');
    }
    const playlist = result.rows[0];
 
 
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
 
  async verifyPlaylistAccess(playlistId, userId) {
      try{
        await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error;
        }
        try {
            await this._collaborationsService.verifyCollaborator(playlistId, userId);
        } catch {
            throw error;
        }
    }
 
  }
 
}
 
module.exports = PlaylistsService;
