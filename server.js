 /******************************************************
 * PLEASE DO NOT EDIT THIS FILE
 * the verification process may break
 * ***************************************************/

'use strict';

var fs = require('fs');
var express = require('express');
var app = express();

var imageSearch = require('node-google-image-search');

//var GoogleSearch = require('google-search');  //setup search
//var googleSearch = new GoogleSearch({
//  key: process.env.key,
//  cx: process.env.cx
//})


/*function gSearch(searchTerm, amount, callback){
  googleSearch.build({
  q: "cats",
  start: 1,
  fileType: "jpg",
  //gl: "tr", //geolocation, 
  //lr: "lang_tr",
  num: 3, // Number of search results to return between 1 and 10, inclusive 
  //siteSearch: "http://kitaplar.ankara.edu.tr/" // Restricts results to URLs from a specified site 
}, function(error, response) {
  callback(response);
}); 
}
*/

if (!process.env.DISABLE_XORIGIN) {
  app.use(function(req, res, next) {
    var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin || '*';
    if(!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1){
         console.log(origin);
         res.setHeader('Access-Control-Allow-Origin', origin);
         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
  });
}

app.use('/public', express.static(process.cwd() + '/public'));

app.route('/_api/package.json')
  .get(function(req, res, next) {
    console.log('requested');
    fs.readFile(__dirname + '/package.json', function(err, data) {
      if(err) return next(err);
      res.type('txt').send(data.toString());
    });
  });
  
app.route('/')
    .get(function(req, res,next) {
		  res.sendFile(process.cwd() + '/views/index.html');

    })

app.route('/imagesearch')
    .get(function(req, res, next) {
      res.send(" this is where search results will be ");

    
    })

    

//////////////////////////////////////////// Respond with searches \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
app.use(function(req, res, next){
  console.log(req.path);
  if ( req.path == '/') return next();  //i dont think this is the correct way of skipping middleware..
  if (req.path == '/favicon.ico') return next(); 
    if (req.path == '/imagesearch') return next(); 
 
  // break it down into search term and amount of searches
  var searchTerm =(req.originalUrl).split('?').shift().split("/").join("").split("%20").join(" ");  //remove garbage 
   var searches = (req.originalUrl).split("=").pop();
  
  if (isNaN(searches)) {searches = 10;}  //allows a search even if syntax is not correct
 
  
    // do search (google api?)  and display
var results = imageSearch(searchTerm, callback, 0, searches); 
function callback(results) {
	var filterRes = results.map( function (item){
    var picked = {"url" : item.link, "snippet": item.snippet, "thumbnail": item.image.thumbnailLink, "context": item.image.contextLink};
    return picked;    
  });  
  res.send(filterRes);
}
  

  



  
});

// Error Middleware
app.use(function(err, req, res, next) {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
})

app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});

