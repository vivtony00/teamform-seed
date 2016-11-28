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

	$scope.autoadd = function(){
		  var eventName = "/events/"+ getURLParameter("q") +"/member/";
		  console.log(eventName);
		  var ref = firebase.database().ref(eventName);
		  var event = $firebaseArray(ref);
		  console.log(event);

		  var teamPath ="/events/"+ getURLParameter("q") + "/team/";
		  var teams = firebase.database().ref(teamPath);
		  var team = $firebaseArray(teams);

		event.$loaded().then( function(data){
			outerloop:
		  for( var mem in event){
			  if(mem != null && typeof mem != "undefined"){
					if ( typeof event[mem].selection != "undefined" && typeof event[mem].selection != "null"){
					  for(var cteam in team){
						     if(typeof team[cteam]["$id"] != "undefined"){
							  	 if ( typeof team[cteam].teamMembers != "undefined" && typeof team[cteam].teamMembers != "null"){
											if( team[cteam].teamMembers.length + team[cteam].currentTeamLeaderSize < team[cteam].currentTeamSize){
										// console.log("have space");
										event[mem].selection =[];
										firebase.database().ref("/events/"+getURLParameter("q") +"/member/" + event[mem]["$id"] ).child('selection').set(null);

										team[cteam].teamMembers.push(event[mem]["$id"]);
										firebase.database().ref("/events/"+getURLParameter("q") +"/team/" + team[cteam]["$id"] ).child('teamMembers').set(
										team[cteam].teamMembers);

										continue outerloop;
									}
								 }
								else{
									// console.log("teammember not defined");
									event[mem].selection =[];
									firebase.database().ref("/events/"+getURLParameter("q") +"/member/" + event[mem]["$id"] ).child('selection').set(null);
									team[cteam].teamMembers=[];
									team[cteam].teamMembers.push(event[mem]["$id"]);
									firebase.database().ref("/events/"+getURLParameter("q") +"/team/" + team[cteam]["$id"] ).child('teamMembers').set(
										team[cteam].teamMembers);
										continue outerloop;
								}

							}
						}

					}
				}

			}
		})
	};
	var refPath = "events/" + getURLParameter("q") + "/team";
	$scope.team = [];
	$scope.team = $firebaseArray(firebase.database().ref(refPath));
	$scope.team.$loaded()
		.then( function(data) {
			// console.log("$scope.teams.$loaded.then");
			console.log($scope.team);
			for (var team in $scope.team) {
				console.log($scope.team[team]);
				for(var leader in $scope.team[team].teamLeaders){
					var leaderid = $scope.team[team].teamLeaders[leader];
					$scope.team[team].teamLeaders[leader] = getProfile(leaderid);
				}
				for(var member in $scope.team[team].teamMembers){
					console.log($scope.team[team].teamMembers[member]);
					var uid = $scope.team[team].teamMembers[member];
					$scope.team[team].teamMembers[member] = getProfile(uid);
					// member.profile.$loaded().then(function(aa){console.log(aa);});
				}

			}
		})
			refPath = "events/" + eventName + "/team";
			$scope.teams = [];

		$scope.teams = $firebaseArray(firebase.database().ref(refPath));
		// console.log($scope.teams);
		$scope.teams.$loaded()
			.then( function(data) {
				// console.log("$scope.teams.$loaded.then");
				// console.log($scope.teams);
				for (var team in $scope.teams) {
					// console.log(team);
					for(var leader in $scope.teams[team].teamLeaders){
						var leaderid = $scope.teams[team].teamLeaders[leader];
						$scope.teams[team].teamLeaders[leader] = getProfile(leaderid);
					}
					for(var member in $scope.teams[team].teamMembers){
						// console.log($scope.teams[team].teamMembers[member]);
						var uid = $scope.teams[team].teamMembers[member];
						$scope.teams[team].teamMembers[member] = getProfile(uid);
						// member.profile.$loaded().then(function(aa){console.log(aa);});
					}
					// $scope.loadFunc();
				}
			})

		var getProfile = function(uid){
		var path= "profile/"+uid;
		var ref = firebase.database().ref(path);
		var profile = $firebaseObject(ref);
		profile.$loaded()
			.catch(function(error) {
				$scope.error = error.message;
				console.error("Error:", error);
			});
		return profile;
		}
		this.getProfile = getProfile;



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
	var profile = $firebaseObject(ref);
	profile.$loaded()
		.catch(function(error) {
			$scope.error = error.message;
			console.error("Error:", error);
		});
	return profile;
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
