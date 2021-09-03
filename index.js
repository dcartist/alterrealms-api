const express = require('express')
const cors = require('cors')
const path = require('path'); 
const app = express()
const axios = require('axios')
app.use(express.json());
const characterController = require('./controllers/Characters')
app.use(express.static(__dirname+'/public'));
app.use(cors())
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
})
// app.get('/', function (req, res) {
 
//   res.send(html_content)
// })
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

