var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');
var mongoose = require('mongoose');
var bluebird = require('bluebird');
var app = express();
app.use(express.static('static'));
app.use(bodyParser.json());

// mongoose.connect('mongodb://fabular_ack:fabular1234@ds139448.mlab.com:39448/fabular');
mongoose.connect('mongodb://localhost/fabular');
mongoose.Promise = bluebird;

const Cards = mongoose.model('card',{
  category : String,
  items : [
    {
      name : String,
      wobble : String
    }
    ]
});


app.get('/things/:category',function(request,response){
  var category = request.params.category;
  Cards.find({ category : category})
  .then(function(data){
    console.log(data);
    response.send(_.shuffle(data[0].items).slice(0,3));
  })
  .catch(function(err){
    console.log(err.stash);
  });
});


app.listen('3000',function(){
  console.log("Server is running");
});
