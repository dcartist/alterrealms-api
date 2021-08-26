// const serverless = require('serverless-http');
const express = require('express')
const cors = require('cors')
const app = express()
const axios = require('axios')
app.use(express.json());
// const parser = require('body-parser')
const characterController = require('./controllers/Characters')

// app.use(express.json());
app.use(cors())
// app.use(parser.urlencoded({ extended: true }))
// app.use(parser.json({ limit: '30mb' }))
// app.use(parser.urlencoded({ extended: true, limit: '30mb' }));
app.get('/', function (req, res) {
  res.send('Hello World!')
})
app.use('/api/characters', characterController)
app.get('/morty', function (req, res) {
  // let morty = {}
  let url = "https://rickandmortyapi.com/api/character"
  axios.get(url)
  .then(results => {
    morty = results.data;
    return res.json(morty)
   console.log( results)
  }).catch(err=>console.log(err))
  // res.send('Hello World!')
})
app.set("port", process.env.PORT || 8080);

app.listen(app.get("port"), () => {
    console.log(`✅ PORT: ${app.get("port")} 🌟`);
    console.log(`http://localhost:${app.get("port")}`)
});

