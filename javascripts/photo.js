'use strict';
var photoURL, messageStr, photoCaption, photoTime, photoTags, photoFriend, myName;
var photoFriendID = [];

function checkLoginState() {
  FB.getLoginStatus(function(response) {
    console.log('login button clicked');
    statusChangeCallback(response);
  });
}


// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
  console.log('statusChangeCallback');
  console.log(response);
  // The response object is returned with a status field that lets the
  // app know the current login status of the person.
  // Full docs on the response object can be found in the documentation
  // for FB.getLoginStatus().
  if (response.status === 'connected') {
    var accessToken = response.authResponse.accessToken;
    console.log('gonna start testapi');
    testAPI();
    // Logged into your app and Facebook.
  } else if (response.status === 'not_authorized') {
    // The person is logged into Facebook, but not your app.
    document.getElementById('status').innerHTML = 'Please log ' +
      'into this app.';
  } else {
    // The person is not logged into Facebook, so we're not sure if
    // they are logged into this app or not.
    document.getElementById('status').innerHTML = 'Please log ' +
      'into Facebook.';
  }
}

window.fbAsyncInit = function() {
  FB.init({
    appId: '791190204336816',
    cookie: true, // enable cookies to allow the server to access
    // the session
    xfbml: true, // parse social plugins on this page
    version: 'v2.2' // use version 2.2
  });

  // Now that we've initialized the JavaScript SDK, we call 
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.

  console.log('app loaded');
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

};

// Load the SDK asynchronously
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s);
  js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

$("#go-button,#again").click(function() {
  startApp();
});

function startApp() {
  var test = getAlbums(
    function(model) {
      console.log(model);
      getPhoto(model);
    });
}


// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function testAPI() {
  console.log('Welcome!  Fetching your information.... ');
  FB.api('/me', function(response) {
    myName = response.name;
    console.log('Successful login for: ' + response.name);
    document.getElementById('status').innerHTML =
      'Welcome, ' + response.name + '!';
  });
  $("#logout-content").css({
    position: 'absolute',
    top: '20px',
    right: '40px'
  });
  $("#go-button").fadeIn(800);
}


var albums, albumNumber, albumID;

function getAlbums(callback) {
  console.log('Getting album id');
  FB.api(
    'me/albums?fields=id&limit=99',
    function(response) {
      if (response && !response.error) {
        albums = response.data;
        albumNumber = getRandomInt(0, albums.length);
        albumID = albums[albumNumber].id;
        console.log(albumID);
        callback(albumID);
      }
    }
  );
}

var photos, photoNumber, photoID;

function getPhoto(ID) {
  console.log('Grabbing random photo');
  FB.api(
    ID + '/photos?limit=99&fields=source, name, created_time, tags',
    function(response) {
      if (response && !response.error) {
        photos = response.data;
        photoNumber = getRandomInt(0, photos.length);
        photoURL = photos[photoNumber].source;
        console.log(photoURL);
        photoID = photos[photoNumber].id;
        photoCaption = photos[photoNumber].name;
        if (typeof photoCaption === 'undefined') {
          photoCaption = 'Your memory from the past!';
        };
        photoTime = photos[photoNumber].created_time;
        photoTags = photos[photoNumber].tags;
        if (typeof photoTags !== 'undefined') {
          if (photoTags.data.length == 1 && photoTags.data[0] == myName) {
            console.log('just me!');
            startApp();
          } else {
            photoFriend = '';
            for (var i = 0; i < photoTags.data.length; i++) {
              if (photoTags.data[i].name != myName) {
                photoFriend += photoTags.data[i].name + ', ';
                photoFriendID[i] = photoTags.data[i].id;
              }
            };
            console.log(photoFriend);
          }
        }
        else {
          console.log('no tags');
          startApp();
        }
        $('.cover-heading').html(photoCaption);
        $('#main-text').html('');
        init();
      }
    }
  );
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}