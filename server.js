// JavaScript File
var express = require('express');
var app = express();
var request = require("request");

app.use(express.static(__dirname + "/public"));

app.listen(process.env.PORT);

console.log('Express server started on port %s', process.env.PORT);

app.get('/authcode', function(req, res) {
  console.log('Authorization code is ' + req.param('code'));
  var code1 = req.param('code');
  res.send('Just for checking getting back the code ' + code1);

  var Client_ID = '293975685409-36hhp7g83nm6rjlmv5nd8lqhavtne94l.apps.googleusercontent.com';
  var client_secret = 'tttiw-xme-8iOaWRInMvYCcv';

  console.log(code1);
  var token_request = 'code=' + code1 +
    '&client_id=' + Client_ID +
    '&client_secret=' + client_secret +
    '&redirect_uri=https://jsubram5-ece9065-lab2-jayantheeswaran.c9users.io' +
    '&grant_type=authorization_code';
  var request_length = token_request.length;
  console.log("requesting: " + token_request);

  request({
      method: 'POST',
      headers: {
        'Content-length': request_length,
        'Content-type': 'application/x-www-form-urlencoded'
      },
      uri: 'https://accounts.google.com/o/oauth2/token',
      body: token_request
    },
    function(error, response, body) {
      if (error) {
        console.log(error);
      } else {
        console.log("Authentication Successful");
        console.log(response.statusCode, body);
        var data = JSON.parse(body);
        console.log(data.access_token);
        var access_token = data.access_token;

        request({
            url: 'https://www.googleapis.com/userinfo/v2/me',
            qs: {
              access_token: access_token
            }, //Query string data
            method: 'GET', //Specify the method
          },

          function(error, response, body) {
            if (error) {
              console.log(error);
            } else {
              console.log(response.statusCode, body);
              /* Parse the response from Google */
              var data = JSON.parse(body);
              console.log("Id =" + data.id);
              console.log("Email = " + data.email);
              console.log("Name = " + data.name);
              console.log("Given Name = " + data.given_name);
              console.log("Family Name = " + data.family_name);
              console.log("Link =" + data.link);
              console.log("Picture link = " + data.picture);
              console.log("Gender =" + data.gender);
              console.log("locale =" + data.locale);
              //Mongo DB Operations
              var MongoClient = require('mongodb').MongoClient;
              var assert = require('assert');
              var ObjectId = require('mongodb').ObjectID;
              var url = 'mongodb://' + process.env.IP + ':27017/test';

              //Connect to Mongo DB server
              MongoClient.connect(url, function(err, db) {
                assert.equal(null, err);
                console.log("Mongo DB Connected !!!");

                var insertDocument = function(db, callback) {
                  db.collection('User').insertOne({
                      "id": data.id,
                      "email": data.email,
                      "verified email": data.verified_email,
                      "name": data.name,
                      "given_name": data.given_name,
                      "family_name": data.family_name,
                      "picture_link": data.picture,
                      "gender": data.gender,
                      "locale": data.locale,

                    },
                    function(err, result) {
                      assert.equal(err, null);
                      console.log("Using mongo db a new document is Inserted into the User collection.");
                      callback();
                    });
                };

                //Insert the received profile into test Database
                insertDocument(db, function() {
                  db.close();
                });
              });
            }
          });
      }
    });
});