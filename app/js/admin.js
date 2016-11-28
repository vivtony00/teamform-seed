$(document).ready(function(){

	$('#admin_page_controller').hide();
	$('#text_event_name').text("Error: Invalid event name ");
	var eventName = getURLParameter("q");
	if (eventName != null && eventName !== '' ) {
		$('#text_event_name').text("Event name: " + eventName);

	};

});

var app = angular.module('teamform-admin-app', ['firebase'])
app.controller('AdminCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$firebaseAuth', function($scope, $firebaseObject, $firebaseArray, $firebaseAuth) {

	// TODO: implementation of AdminCtrl

	// Initialize $scope.param as an empty JSON object
	$scope.param = {};

	// Call Firebase initialization code defined in site.js
	initalizeFirebase();

	var refPath, ref, eventName;

	eventName = getURLParameter("q");
	refPath = "events/"+ eventName + "/admin/param";
	ref = firebase.database().ref(refPath);

	// Link and sync a firebase object

	$scope.param = $firebaseObject(ref);
	$scope.param.$loaded()
		.then( function(data) {

			// Fill in some initial values when the DB entry doesn't exist
			if(typeof $scope.param.maxTeamSize == "undefined"){
				$scope.param.maxTeamSize = 10;
			}
			if(typeof $scope.param.minTeamSize == "undefined"){
				$scope.param.minTeamSize = 1;
			}

			// Enable the UI when the data is successfully loaded and synchornized
			$('#admin_page_controller').show();
		})
		.catch(function(error) {
			// Database connection error handling...
			//console.error("Error:", error);
		});


	refPath = "events/" + eventName + "/team";
	$scope.team = [];
	$scope.team = $firebaseArray(firebase.database().ref(refPath));


	refPath = "events/" + eventName + "/member";
	$scope.member = [];
	$scope.member = $firebaseArray(firebase.database().ref(refPath));



	$scope.changeMinTeamSize = function(delta) {
		var newVal = $scope.param.minTeamSize + delta;
		if (newVal >=1 && newVal <= $scope.param.maxTeamSize ) {
			$scope.param.minTeamSize = newVal;
		}

		$scope.param.$save();


	}

	$scope.changeMaxTeamSize = function(delta) {
		var newVal = $scope.param.maxTeamSize + delta;
		if (newVal >=1 && newVal >= $scope.param.minTeamSize ) {
			$scope.param.maxTeamSize = newVal;
		}

		$scope.param.$save();


	}

	$scope.saveFunc = function() {

		$scope.param.$save();

		// Finally, go back to the front-end
		window.location.href= "index.html";
	}


}]);

app.controller('LoginCtrl', ['$scope', '$firebaseObject', '$firebaseArray','$firebaseAuth', function($scope, $firebaseObject, $firebaseArray, $firebaseAuth) {

  // Call Firebase initialization code defined in site.js
  initalizeFirebase();
  $scope.message = null;
  $scope.error = null;
  $scope.uid = null;
  $scope.logedin =false;
  $scope.profile= null;
  $scope.auth = $firebaseAuth();

  $scope.loginValidation=function(){
    if($scope.username==null&&$scope.password==null){
      $scope.message = "Please fill in the email and password above";
      return false;
    }
    return true;
  }

  $scope.emailAccCreate=function(){
    if($scope.loginValidation()==false){
      return false;
    }
    $scope.auth = $firebaseAuth();
    $scope.auth.$createUserWithEmailAndPassword($scope.username, $scope.password)
    .catch(function(error) {
      $scope.error = error.message;
    });
  };

  $scope.emailLogin=function(){
    if($scope.loginValidation()==false){
      return false;
    }
    $scope.auth = $firebaseAuth();
    // console.log("$scope.username,$scope.password",$scope.username,$scope.password);
    firebase.auth().signInWithEmailAndPassword($scope.username, $scope.password).catch(function(error){
    // $scope.auth.signInWithEmailAndPassword($scope.username, $scope.password).catch(function(error){
      $scope.error = error.message;
      console.error("email Login failed(ng):", error);
    });
  };

  $scope.fbLogin=function(){
    $scope.auth.$signInWithPopup("facebook")
    .catch(function(error) {
      $scope.error = error.message;
      console.error("FB Login fail(ng)",error);
    });
  };

  $scope.signOut =function(){
    $scope.auth.$signOut();
  }

  var getProfile = function(uid){
    var path= "profile/"+uid;
    var ref = firebase.database().ref(path);
    $scope.profile = $firebaseObject(ref);
    $scope.profile.$loaded()
      .catch(function(error) {
        $scope.error = error.message;
        console.error("Error:", error);
      });
    return $scope.profile;
  }
  this.getProfile = getProfile;

  $scope.auth.$onAuthStateChanged(function(firebaseUser) {
    if (firebaseUser) {
      $scope.message = "Signed in as:"+ firebaseUser.uid;
      $scope.logedin =true;
      $scope.uid = firebaseUser.uid;
      $scope.profile = getProfile(firebaseUser.uid);
       console.log("Signed in as:", firebaseUser.uid);
    } else {
      $scope.logedin =false;
      $scope.message = "Signed out";
      console.log("Signed out");
    }
  });


}]);
