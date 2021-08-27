const express = require('express')
const cors = require('cors')
const app = express()
const axios = require('axios')
app.use(express.json());
const characterController = require('./controllers/Characters')
app.use(cors())
app.get('/', function (req, res) {
  res.send('Hello World!')
})
app.use('/api', characterController)
app.get('/morty', function (req, res) {
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

