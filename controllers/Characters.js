const express = require("express");
const Character = require("../db/models/Characters");
const axios = require('axios');
const router = express.Router();

router.get("/", (req, res) => {
    Character.find().then(allUsers => {
    res.json(allUsers);
  });
});

//* Finding by name
router.get("/character/name/:name", (req, res) => {
    Character.find().then(allUsers => {
    var results = allUsers.filter(item => item.name.toLowerCase().includes(req.params.name.toLowerCase()))
    res.json(results);

  });
});

//* Finding by id
router.get("/character/id/:id", (req,res)=> {
    Character.findOne({ id: req.params.id }).then( results => {
        res.json(results)
    })
})

//* Adding a win to an id
router.get("/character/win/:id", (req,res)=> {
    Character.findOneAndUpdate({id: req.params.id}, {$inc:{wins: 1, rounds:1}}, {new: true}, (err, results) => {
        if (err) {
            console.log("oops!");
        }
        res.json(results)
    })
})

//* Adding a lose to an id
router.get("/character/lose/:id", (req,res)=> {
    Character.findOneAndUpdate({id: req.params.id}, {$inc:{lost: 1, rounds:1}}, {new: true}, (err, results) => {
        if (err) {
            console.log("oops!");
        }
        res.json(results)
    })
})

//* Finding by species
router.get("/character/species/:species", (req,res)=> {
    Character.find({ species: req.params.species }).then( results => {
        res.json(results)
    })
})

//* Showing top 5 wins
router.get("/top/wins", (req, res) => {
    Character.find({}).then(
        results => {
            results.sort((a, b) => b.wins - a.wins);
            console.log()
            res.json(results.splice(0,5).filter(character => character.wins !== 0))
        }
    )
})


//* Showing top 5 players
router.get("/top/player", (req, res) => {
    Character.find({}).then(
        results => {
            results.sort((a, b) => b.rounds - a.rounds);
            console.log()
            res.json(results.splice(0,5).filter(character => character.rounds !== 0))
        }
    )
})


//* Showing top 5 losses
router.get("/top/losts", (req, res) => {
    Character.find({}).then(
        results => {
            results.sort((a, b) => b.lost - a.lost);
            res.json(results.splice(0,5).filter(character => character.lost !== 0))
        }
    )
})

//* Droping Db
router.get("/alter", (req, res) => {
    Character.deleteMany().then( results => {
        res.json({"nothing":"here"});
    }
    )
})


//* Altering data for db
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


//* Inserting all characters into database from Rick&Morty API
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


//* Route to start the population process
router.get("/auto", (req, res) => {
    grabupdate ()
    Character.find().then(allUsers => {
        res.send("And We're done");
    })
}

)


//* Adding a page from rick and morty api
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