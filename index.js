const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express()
const db = require('./queries')
const port = 3000

app.use(cors()) 
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use(function(request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
next();
});


app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})
// Customers
app.get('/customers', db.getUsers)
app.get('/customers/:id', db.getUserById)
app.get('/cus', db.getUserByName)
app.post('/customers', db.createUser)
app.put('/customers/:id', db.updateUser)
app.delete('/customers/:id', db.deleteUser)

// users
app.get('/users',db.getusers)
app.get('/users/:id',db.getusersid)
app.get('/user',db.getusersByName)
app.post('/users',db.createusers)
app.put('/users/:id',db.updateusers)
app.delete('/users/:id',db.deleteUsers)

// reservations
app.get('/reservation',db.getreservation)
app.get('/reservation/:id',db.getreservationid)
// app.get('/user',db.getusersByName)
app.post('/reservation',db.createreservation)
app.put('/reservation/:id',db.updatereservation)
app.delete('/reservation/:id',db.deletereservation)

// reserved_rooms
app.get('/reservedrooms',db.getreservedrooms)
app.get('/reservedrooms/:id',db.getreservedroomsid)
// app.get('/user',db.getusersByName)
app.post('reservedrooms',db.createreservedrooms)
app.put('/reservedrooms/:id',db.updatereservedrooms)
app.delete('/reservedrooms/:id',db.deletereservedrooms)

// LOGIN
app.post('/api/register',db.register);
app.post('/api/authenticate',db.authenticate);

// Player
app.get('/player',db.players);
// app.post('/player',db.createplayer);

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})