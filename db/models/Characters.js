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
    origin_name: {
      type: String
    },
    origin_url: {
      type: String
    },
    location_name: {
      type: String
    },
    location_url: {
      type: String
    },
    type: {
      type: String
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
    losses: {
      type: Number
    },
    ties: {
      type: Number
    }
});

let character = mongoose.model('Character', CharacterSchema)
module.exports = character