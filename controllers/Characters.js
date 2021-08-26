const express = require("express");
const router = express.Router();
const Character = require("../db/models/Characters");
const axios = require('axios')

router.get("/", (req, res) => {
    Character.find().then(allUsers => {
    res.json(allUsers);
  });
});


router.get("/adding/:numner", (req, res) => {
    let url = "https://rickandmortyapi.com/api/character"
    axios.get(url)
    .then(results => {
      morty = results.data;
      return res.json(morty)
     console.log( results)
    }).catch(err=>console.log(err))

    res.json(adding);
})
// router.get("/adding/:numner", (req, res) => {
//     let url = "https://rickandmortyapi.com/api/character"
//     axios.get(url)
//     .then(results => {
//       morty = results.data;
//       return res.json(morty)
//      console.log( results)
//     }).catch(err=>console.log(err))

//     res.json(adding);
// })



module.exports = router