'use strict';
var photoURL;
(function() {

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
      // Logged into your app and Facebook.
      startApp();
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

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
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

  // function startApp() {
  //   testAPI();
  //   getAlbums();
  //   if (waiting == false) {
  //     getPhoto(albumID);
  //   }
  // }

  function startApp() {
    testAPI();
    var test = getAlbums(
      function(model) {
        console.log(model);
        getPhoto(model);
      });
  };


  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    });
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

  var photos, photoNumber;
  function getPhoto(ID) {
    console.log('Grabbing random photo');
    FB.api(
      ID + '/photos?limit=99&fields=source',
      function(response) {
        if (response && !response.error) {
          photos = response.data;
          photoNumber = getRandomInt(0, photos.length);
          photoURL = photos[photoNumber].source;
          console.log(photoURL);
          init();
        }
      }
    );
  }

  // document.getElementsByClassName('photo')[0].innerHTML = '<img src=' + response.data.url + '>';

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

}());