var express = require('express');
var router = express.Router();
var fs = require('fs');

var list = [];
var start_id=1;
var end_id=37;
var curr_id;
var name;

/* GET New User page. */
router.get('/newuser', function(req, res) {
  res.render('newuser', { title: 'Webpage perception' });
});

/* POST to Add User Service */
router.post('/adduser', function(req, res) {

  // Set our internal DB variable
  var db = req.db;

  // Get our form values. These rely on the "name" attributes
  var userName = req.body.username;
  var email = req.body.email;
  var age = req.body.age;
  var gender = req.body.gender;
  var location = req.body.location;

  // Set our collection
  var collection = db.get('usercollection');
  //Randomize the website order and save to a global variable
  randomize();

  // Submit to the DB
  collection.insert({
    "username" : userName,
    "email" : email,
    "gender" : gender,
    "age" : age,
    "location" : location
  }, function (err, doc) {
    if (err) {
      // If it failed, return error
      res.send("There was a problem adding the information to the database.");
      console.log(err);
    }
    else {
      // And forward to success page
      console.log(doc);
      // console.log("User age is " + doc.age);
      var abc = doc ._id;
      // console.log("User added as " + doc._id);
      req.session.user = abc;
      req.session.list = list;
      res.redirect("webpage");
    }
  });
});

/* GET website-display page. */
router.get('/webpage', function(req, res, next) {
  name = req.session.user;
  var db = req.db;
  console.log('In session ' + name);
  var collection = db.get('webpages');
  list = req.session.list;

  // Get a value from the list and remove it from the it.
  curr_id= list[list.length-1];
  if(curr_id == null){
    res.render('thanks');
  }
  list.pop();
  req.session.curr_id = curr_id;
  console.log("Current id is: "+curr_id);
  console.log('List is' + list);


  collection.findOne({id: curr_id.toString()}, function(err, result){
    if (err)
      throw err;
    if(result!=null) {
      console.log("Result is: " + result);
      // res.render('webpage', req);
      res.render('webpage', {
        "result": result
      })
    }
  });
});

/* GET rating page. */
router.post('/rate', function(req, res, next) {
  name = req.session.user;
  req.session.user = name;
  list = req.session.list;
  req.session.list = list;
  curr_id = req.session.curr_id;
  req.session.curr_id = curr_id;


  console.log('In session' + name);
  console.log('List is' + list);


  var timeElapsed = req.body.timeElapsed;
  var distanceScroll = req.body.distanceScroll;
  var percentScroll = req.body.percentScroll;
  var docHeight = req.body.docHeight;
  var scrolled = req.body.scrolled;


  // if(timeElapsed == ""){
  //   timeElapsed = 100;
  // }
  req.session.timeElapsed = timeElapsed;
  req.session.distanceScroll = distanceScroll;
  req.session.percentScroll = percentScroll;
  req.session.docHeight = docHeight;
  req.session.scrolled = scrolled;


  res.render('rate', req);
});

/* POST to Rating Service */
router.post('/saverating', function(req, res) {

  // Set our internal DB variable
  var db = req.db;
  name = req.session.user;
  req.session.user = name;
  list = req.session.list;
  req.session.list = list;
  curr_id = req.session.curr_id;
  req.session.curr_id = curr_id;



  // Get our form values. These rely on the "name" attributes
  var rating = req.body.rating;
  var timeElapsed = req.session.timeElapsed;
  var distanceScroll = req.session.distanceScroll;
  var percentScroll = req.session.percentScroll;
  var docHeight = req.session.docHeight;
  var scrolled = req.session.scrolled;


  var collection = db.get('rating');
  // Submit to the DB
  collection.insert({
    "user_id" : name,
    "webpage_id" : curr_id,
    "position" : end_id-list.length+1,
    "rating" : rating,

    "distanceScroll" : distanceScroll,
    "percentScroll" : percentScroll,
    "docHeight" : docHeight,
    "scrolled" : scrolled
  }, function (err, doc) {
    if (err) {
      // If it failed, return error
      res.send("There was a problem adding the information to the database.");
      console.log(err);
    }
    else {
      // And forward to success page
      // console.log(doc);
      // console.log("User age is " + doc.age);
      // var abc = doc ._id;
      // console.log("User added as " + doc._id);
      // req.session.user = abc;
      res.redirect("webpage");
    }
  });

  res.redirect("webpage");
});

/* GET thanks page. */
router.get('/welcome', function(req, res, next) {
  // var name = req.session.user;
  // console.log('In session' + name);
  res.render('welcome', req);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Configuration completed!! :)' });
});

/* GET welcome page. */
router.get('/welcome', function(req, res, next) {
  var name = req.session.user;
  console.log('In session' + name);

  res.render('welcome', req);
});


/* GET dbtest page. */
router.get('/userlist', function(req, res) {
  var db = req.db;

  //Get collection
  var collection = db.get('webpages');

  var test =  collection.find({},{},function(err,docs){
    // console.log(docs);
        if(!err) {
          callback(null,docs);
        } else {
          callback("error");
        }
    });

  // test.length;
    console.log("Length is: "+ test.length);
    collection.findOne({id: '2'}, function(err, user) {
      console.log("What? "+ user.url);
    });
});


//To randomize an array of numbers
function randomize(){
  list=[];
  for (var i = start_id; i <= end_id; i++) {
    list.push(i);
  }
  shuffle(list);
  list.push(50);
  list.reverse();
  console.log("I is set to: "+ list);
}
//To shuffle the generated array between limits.
function shuffle(array) {
  var m = array.length, t, i;
  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

module.exports = router;