$(document).ready(function(){
  firebase.auth().getRedirectResult().then(function(result) {
    if (result.credential) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // ...
      console.log("Facebook Login successfully");
    }
    // The signed-in user info.
    var user = result.user;
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
      console.log("Facebook Login failed");
      console.log(errorCode);
      console.log(errorMessage);
      console.log(email);
      console.log(credential);
  });

    $("#btn_admin").click(function(){
    	var val = $('#input_text').val();
    	if ( val !== '' ) {
    		var url = "admin.html?q=" + val;
    		window.location.href= url ;
    		return false;
    	}
    });

    $("#btn_leader").click(function(){
    	var val = $('#input_text').val();
    	if ( val !== '' ) {
    		var url = "team.html?q=" + val;
    		window.location.href= url ;
    		return false;
    	}
    });

    $("#btn_member").click(function(){
    	var val = $('#input_text').val();
      console.log(val);
    	if ( val !== '' ) {
    		var url = "member.html?q=" + val;
    		window.location.href= url ;
    		return false;
    	}
    });

    $("#btn_create_email_acc").click(function(){
      var email = $('#input_email').val();
      var password = $('#input_password').val();
      firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        console.log("email_acc create failed");
        console.log(errorCode);
        console.log(errorMessage);
        console.log(email);
        console.log(credential);
      });
    });
    $("#btn_login_out").click(function(){
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
        console.log("Sign-out successful.");
      }, function(error) {
        // An error happened.
        console.log("Sign-out failed");
        console.log(error.code);
        console.log(erroe.message);
      });
    });
    $("#btn_login_email").click(function(){
      var email = $('#input_email').val();
      var password = $('#input_password').val();
      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
    });

    $("#btn_login_fb").click(function(){
      console.log("creating Facebook provider");
      var Facebookprovider = new firebase.auth.FacebookAuthProvider();
      console.log("Facebook Login start");
      firebase.auth().signInWithRedirect(Facebookprovider);
    });
});
