const express = require('express');
const router = express.Router();
const [User,Data] = require('./db.js');

router.get('/',(req,res)=>{
    res.sendFile(__dirname + '/views/index.html'); 
})

router.post('/api/users', async (req,res)=>{
   const userData = req.body;
   const user = new User({username: userData.username});
   try {
    const result = await user.save();
    res.json({username:result.username, _id:result._id});
   } catch (error) {
    console.log('Error found :- '+error);
   }
})

router.get('/api/users',async (req,res)=>{
    try {
        const result = await User.find({});
        res.json(result);
    } catch (error) {
        console.log(error);
    }
})  

router.post('/api/users/:_id/exercises', async (req,res)=>{
    const body = req.body;
    const id = req.params._id;
    const ele = {
        description: body.description,
        duration: +body.duration,
        date: (new Date(body.date)).toDateString()
    }
    try {
        const username = await User.findById({_id:id});
        if(username){
            const present = await Data.findById({_id:id});
            if(present){
                const result = await Data.updateOne({_id:id},{$push:{logs:ele}});
                console.log(result);
            }
            else{
                const data = new Data({_id:id, logs:[ele]});
                const result = await data.save();
                console.log(result);
            }
            res.json({_id:id, username:username.username, ...ele});
        }
        else{
            res.send("No Id found!");
        }
    } catch (error) {
        console.error("error :- ", error);
    }

})

router.get('/api/users/:_id/logs/', async (req,res)=>{
    const id = req.params._id;
    const from = new Date(req.query.from);
    const to = new Date(req.query.to);
    const limit = +req.query.limit;
    try {
        const user = await User.findById({_id:id});
        if(user){
            const data = await Data.findById({_id:id});
            let logs = data.logs.map(x=>{
                const obj = {
                    description: x.description,
                    duration: x.duration,
                    date: x.date
                }
                if(to && from){
                    if((from <= Date(x.date) <= to)){
                        return obj;
                    }
                }
                return obj;
            });
            let count = logs.length;
            if(limit < count){
                count = limit
                logs = logs.slice(0,limit);
            }
            const result = {
                _id: id,
                username: user.username,
                count: count,
                logs:logs
            }
            res.send(result);
        }
        else{
            res.send("No user found!");
        }
    } catch (error) {
        console.log(error); 
    }
})


module.exports = router;
