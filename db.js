const mongoose = require('mongoose');
require('dotenv').config();
const URI = process.env.URI;


async function calling(){
    try {
        await mongoose.connect(URI, {dbName:'Exercise_tracker',useNewUrlParser: true, useUnifiedTopology:true})
        console.log('Database-connected!!');
    } catch (error) {
        console.error('Error found:', error);
    }
}

calling();


// Models

const UserSchema = mongoose.Schema({
    username:{
        type:String,
        required: true
    }
})

const DataSchema = mongoose.Schema({
    _id:String,
    count:Number,
    logs:[{
        description: String,
        duration: Number,
        date: Date
    }],
},{collection:'data'});

const User = mongoose.model('User', UserSchema);

const Data = mongoose.model("Data",DataSchema);

module.exports = [User,Data];

