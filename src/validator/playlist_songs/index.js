const InvariantError = require('../../exceptions/InvariantError');
const { Playlist_songPayloadSchema } = require('./schema');
 
const Playlist_songsValidator = {
  validatePlaylist_songPayload: (payload) => {
    const validationResult = Playlist_songPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
 
module.exports = Playlist_songsValidator;
