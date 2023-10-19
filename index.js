const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const body_parser = require('body-parser');


app.use(cors())
app.use(body_parser.urlencoded({extended:false}));
app.use(express.static('public'))
app.use('/',require('./Routes.js'))



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
