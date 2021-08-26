const mongoose = require('../connection/connection')

const CharacterSchema = mongoose.Schema({ 
   id: {
      type: Number
    },
    name: {
      type: String
    },
    species: {
      type: String
    },
    origin: {
      type: String
    },
    origin_url: {
      type: String
    },
    location: {
      type: String
    },
    location_url: {
      type: String
    },
    times_used: {
      type: Number
    },
    wins: {
      type: Number
    },
    rounds: {
      type: Number
    },
    image_url: {
      type: String
    },
    lost: {
      type: Number
    }
});

let character = mongoose.model('Character', CharacterSchema)
module.exports = character