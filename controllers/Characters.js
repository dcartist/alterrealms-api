const express = require("express");
const Character = require("../db/models/Characters");
const axios = require('axios');
const router = express.Router();
var fs = require('fs');
const writeStream = fs.createWriteStream('file.txt');
router.get("/", (req, res) => {
    Character.find().then(allUsers => {
    res.json(allUsers);
  });
});

// router.get("/name", (req, res) => {
//     let user = []
//     Character.find().then(allUsers => {
//     allUsers.map(item=>user.push(item.name))
//     console.log(user)
//     user.forEach(value => writeStream.write(`"${value}",\n`));
//     // fs.writeFile('text.txt', user, function (err) {
//     //     if (err) throw err;
//     //     console.log('Saved!');
//     //   });
//     res.json(allUsers);
//   });
// });



router.get("/top/20", (req, res) => {
    Character.find({}).sort({id: 0}).then(allUsers => {
    res.json(allUsers.splice(0,20));
  });
});

//* Finding by name
router.get("/character/name/:name", (req, res) => {
    Character.find().then(allUsers => {
    let firstSearch = allUsers.filter(item => item.name.toLowerCase().includes(req.params.name.toLowerCase()))
    // let results = firstSearch.filter(item => !item.name.includes("’s") || !item.name.includes("'s") || !item.name.includes("’s") ||  !item.name.includes("’s") )
    let results = firstSearch.filter(item => !item.name.includes("’s") && !item.name.includes("'s") )
    res.json(results);

  });
});
//* Finding not Sanchez Family
// Rick Morty Beth Jerry Summer
router.get("/character/notfamily", (req, res) => {
    let sanchez = ["jerry", "beth", "jerry", "summer"]
    Character.find({}).then(allUsers => {
    let results =  sanchez.map(name => allUsers.filter (item => !item.name.toLowerCase().includes(name.toLowerCase())) )
    //  filteredResults = allUsers.filter(item => !item.name.toLowerCase().includes(req.params.name.toLowerCase()))
    res.json(results);

  });
});


//* Finding not Jerry




//* Finding by id
router.get("/character/id/:id", (req,res)=> {
    Character.findOne({ id: req.params.id }).then( results => {
        res.json(results)
    })
})

//* Adding win and loose in call
router.get("/gameplay/results/:win/:lose", (req,res)=> {
    Character.findOneAndUpdate({id: req.params.win}, {$inc:{wins: 1, rounds:1}}, {new: true}).then(
        winresults => {
            Character.findOneAndUpdate({id: req.params.lose}, {$inc:{losses: 1, rounds:1}}, {new: true}).then( loseResults => {
                Character.find({id: { $in: [req.params.win, req.params.lose] }}).then( 
                    results => res.json(results)
                    )
            })
        }
    ).catch(err=>console.log(err))
})

//* Adding a win to an id
router.get("/gameplay/win/:id", (req,res)=> {
    Character.findOneAndUpdate({id: req.params.id}, {$inc:{wins: 1, rounds:1}}, {new: true}, (err, results) => {
        if (err) {
            console.log("oops!");
        }
        res.json(results)
    })
})
//* Adding tie to two ids
router.get("/gameplay/tie/:id1/:id2", (req,res)=> {
    Character.updateMany(
        { id: { $in: [req.params.id1, req.params.id2] } },
        { $inc: {ties: 1, rounds:1} },
        { multi: true, new: true},
        
     ).then(
         results => {
            Character.find({id: { $in: [req.params.id1, req.params.id2] }}).then( 
                results => res.json(results)
                )
        }
     ).catch(err=> res.json(err))
})

//* Adding a lose to an id
router.get("/gameplay/lose/:id", (req,res)=> {
    Character.findOneAndUpdate({id: req.params.id}, {$inc:{losses: 1, rounds:1}}, {new: true}, (err, results) => {
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

//* Showing top 5 winners
router.get("/top/wins", (req, res) => {
    Character.find({}).then(
        results => {
            results.sort((a, b) => b.wins - a.wins);
            console.log()
            res.json(results.splice(0,5).filter(character => character.wins !== 0))
        }
    )
})


//* Showing top 5 played characters
router.get("/top/player", (req, res) => {
    Character.find({}).then(
        results => {
            results.sort((a, b) => b.rounds - a.rounds);
            console.log()
            res.json(results.splice(0,5).filter(character => character.rounds !== 0))
        }
    )
})
//* Showing top 5 tied characters
router.get("/top/tied", (req, res) => {
    Character.find({}).then(
        results => {
            results.sort((a, b) => b.ties - a.ties);
            res.json(results.splice(0,5).filter(character => character.ties !== 0))
        }
    )
})


//* Showing top 5 losers
router.get("/top/losses", (req, res) => {
    Character.find({}).then(
        results => {
            results.sort((a, b) => b.losses - a.losses);
            res.json(results.splice(0,5).filter(character => character.losses !== 0))
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
        data.losses = 0
        data.ties = 0
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
    Character.find().then(allUsers =>res.send(`And We're done ${allUsers.length}`))
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

//* Adding Pagination
router.get("/page/:skip/:limit", (req, res) => {
    let limit = parseInt(req.params.limit) //turning information of limit into a number instead of a string
    let skip = (parseInt(req.params.skip)-1) * limit //turning information of skip into a number instead of a string

    //also skip is how many records to skip, so skip is skip - 1 because records start at 0, and multiply it by the limit (items per page)
    Character.find({},null,{limit:limit,skip:skip}).then(results => {res.json(results)}).catch(err=>console.log(err))
})

router.get("/characters/page/:skip/:limit", (req, res) => {
    let limit = parseInt(req.params.limit)
    let skip = (parseInt(req.params.skip)-1) * limit

    Character.find({},null,{limit:limit,skip:skip}).then(data => {
        let results = {};
        for(var i=0;i<data.length;i++){
            results[i+skip]=data[i];
        }
        // data.forEach((item,index) => {data[index]['sortOrder']=i;
        // i++;}
        // )

        res.json(results)
    }).catch(err=>console.log(err))
})


module.exports = router