const express = require("express");
const Character = require("../db/models/Characters");
const axios = require('axios');
const { findOne } = require("../db/models/Characters");
const router = express.Router();

router.get("/", (req, res) => {
    Character.find().then(allUsers => {
    res.json(allUsers);
  });
});

router.get("/character/id/:id", (req,res)=> {
    Character.findOne({ id: req.params.id }).then( results => {
        res.json(results)
    })
})

router.get("/character/win/:id", (req,res)=> {
    Character.findOneAndUpdate({id: req.params.id}, {$inc:{wins: 1, rounds:1}}, {new: true}, (err, results) => {
        if (err) {
            console.log("oops!");
        }
        res.json(results)
    })
})
router.get("/character/lost/:id", (req,res)=> {
    Character.findOneAndUpdate({id: req.params.id}, {$inc:{lost: 1, rounds:1}}, {new: true}, (err, results) => {
        if (err) {
            console.log("oops!");
        }
        res.json(results)
    })
})
router.get("/character/species/:species", (req,res)=> {
    Character.find({ species: req.params.species }).then( results => {
        res.json(results)
    })
})

router.get("/alter", (req, res) => {
    Character.deleteMany().then( results => {
        res.json({"nothing":"here"});
    }
    )
})


function altered(info, finalResults){
    finalResults = info.map(data => {
        data.image_url = data.image
        data.origin_url = data.origin.url
        data.origin_name = data.origin.name
        data.location_name = data.location.name
        data.location_url = data.location.url
        data.wins = 0
        data.lost = 0
        data.rounds = 0

    })

    return finalResults

}
// router.get("/add", (req, res) => {
//     let finalResults = []
//     let morty
//     let url = "https://rickandmortyapi.com/api/character"
//     axios.get(url)
//     .then(results => {
//       morty = results.data;
//     altered(morty.results, finalResults)
//     console.log(morty.results)
//     Character.findOrCreate(morty.results).then(results => {
//         res.json(results)
//     })
//     }).catch(err=>console.log(err))

// })

function grabupdate (){
    let finalResults = []
    let morty
    for (let i=1; i <= 34; i++){
        let url = `https://rickandmortyapi.com/api/character/?page=${i}`
        axios.get(url)
        .then(results => {
          morty = results.data;
        altered(morty.results, finalResults)
        Character.create(morty.results).then(results => {
            console.log(`page ${i}`)
        })
        }).catch(err=>console.log(err))
    }
}
router.get("/auto", (req, res) => {
    grabupdate ()
    Character.find().then(allUsers => {
        res.json(allUsers);
    })
}

)
router.get("/add/:number", (req, res) => {

    let finalResults = []
    let morty
    console.log(req.params.number)
    let url = `https://rickandmortyapi.com/api/character/?page=${req.params.number}`
    axios.get(url)
    .then(results => {
      morty = results.data;
    altered(morty.results, finalResults)
    console.log(morty.results)
    Character.create(morty.results).then(results => {
        res.json(results)
    })
    }).catch(err=>console.log(err))
})



module.exports = router