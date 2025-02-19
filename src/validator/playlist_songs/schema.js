const Joi = require('joi');
 
const Playlist_songPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});
 
module.exports = { Playlist_songPayloadSchema };
