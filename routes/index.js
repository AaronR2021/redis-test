var express = require('express');
var fetch = require('node-fetch');
var router = express.Router();

//redis block------
var { createClient } = require('redis');
var client = createClient({ host: 'localhost', port: 6379 })

client.connect();

client.on('connect', () => console.log('Redis Client Connected'));
client.on('error', (err) => console.log('Redis Client Connection Error', err));
//------------------

/* GET home page. */
router.get('/', async function (req, res, next) {

  try{
    //get data to check if hit or miss
    var photos= await client.GET('photo')
  }catch(e){
    next(e)
  }
  //miss
  if(photos==null){
    console.log('cache miss')
   var data=await fetch('https://jsonplaceholder.typicode.com/photos')
   var result=await data.json()
   //save in redis
   client.SETEX('photo',3600,JSON.stringify(result))
   //send the data
   res.json({result})
  }
  //hit
  else{
    console.log('cache hit')
    var photos= await client.GET('photo')
    res.json({
      photos
    })
  }
 // why isnt the values been shown on redis-cli?> but it works

});

module.exports = router;
