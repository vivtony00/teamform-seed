$(document).ready(function(){

	$('#member_page_controller').hide();
	$('#text_event_name').text("Error: Invalid event name ");
	var eventName = getURLParameter("q");
	if (eventName != null && eventName !== '' ) {
		$('#text_event_name').text("Event: " + eventName);
		$('#member_page_controller').show();
	}
	var o = new Date
		, r = ("0" + (o.getDate() + 3)).slice(-2)
		, s = ("0" + (o.getMonth() + 1)).slice(-2)
		, n = o.getFullYear()
		, i = n + "/" + s + "/" + r;
	$("#clock").countdown({
			date: i
	})
});

var app = angular.module('teamform-member-app', ['firebase']);
app.controller('MemberCtrl', ['$scope', '$firebaseObject', '$firebaseArray', "$firebaseAuth","orderByFilter", function($scope, $firebaseObject, $firebaseArray, $firebaseAuth, orderBy) {
	// Call Firebase initialization code defined in site.js
	initalizeFirebase();
		// TODO: implementation of MemberCtrl
	$scope.userID = "";
	$scope.userName = "";
	$scope.teams = [];

	$scope.auth=$firebaseAuth();
	$scope.auth.$onAuthStateChanged(function(firebaseUser) {
  		if (firebaseUser) {
    		$scope.uid = firebaseUser.uid;
  		}
  		else {
    		console.log("Signed out");
  		}
    });

	$scope.loadFunc = function() {
		var userID = $scope.userID;
		if ( userID !== '' ) {

			var refPath = "/events/"+ getURLParameter("q") + "/member/" + userID;
			retrieveOnceFirebase(firebase, refPath, function(data) {

				if ( data.child("name").val() != null ) {
					$scope.userName = data.child("name").val();
				} else {
					$scope.userName = "";
				}


				if (data.child("selection").val() != null ) {
					$scope.selection = data.child("selection").val();
				}
				else {
					$scope.selection = [];
				}
				$scope.$apply();
			});
		}
	}



	$scope.saveFunc = function() {
		var userID = $.trim( $scope.userID );
		var userName = $.trim( $scope.userName );

		if ( userID !== '' && userName !== ''  ) {
			var newData = {
				'name': userName,
				'selection': $scope.selection
			};

			var refPath = "/events/"+ getURLParameter("q") + "/member/" + userID;
			var ref = firebase.database().ref(refPath);

			ref.set(newData, function(){
				window.location.href= "index.html";
			});
		}
	}

	$scope.refreshAds = function() {
		var refPath = "/events/"+ getURLParameter("q") + "/advertisement";
		var ref = firebase.database().ref(refPath);

		$scope.advertisements = $firebaseArray(ref);
		$scope.advertisements.$loaded()
			.then( function(data) {

			})
			.catch(function(error) {
				// Database connection error handling...
				//console.error("Error:", error);
			});


	}

	$scope.refreshAds();


	$scope.selectall = function(){


		$scope.selection=[];
		$scope.team=[];
		var refPath = "/events/"+ getURLParameter("q") + "/team/";
		$scope.team = $firebaseArray(firebase.database().ref(refPath));
		$scope.team.$loaded().then( function(data){

			console.log($scope.team);
			for(var team in $scope.team){
				console.log($scope.team[team].$id);
				if(typeof $scope.team[team].$id != "undefined"){
				$scope.selection.push($scope.team[team].$id);
				}
			}

			var userID = $.trim( $scope.userID );
			var userName = $.trim( $scope.userName );
			if ( userID !== '' && userName !== ''  ) {
				var newData = {
					'name': userName,
					'selection': $scope.selection
				};

				var refPath = "/events/"+ getURLParameter("q") + "/member/" + userID;
				var ref = firebase.database().ref(refPath);

				ref.set(newData, function(){
				})
			}
		})

	}

	$scope.refreshTeams = function() {
		var refPath = "/events/"+ getURLParameter("q") + "/team";
		var ref = firebase.database().ref(refPath);

		// Link and sync a firebase object
		$scope.selection = [];
		$scope.toggleSelection = function (item) {
			var idx = $scope.selection.indexOf(item);
			if (idx > -1) {
				$scope.selection.splice(idx, 1);
			}
			else {
				$scope.selection.push(item);
			}
		}

		$scope.teams = $firebaseArray(ref);
		console.log($scope.teams);
		$scope.teams.$loaded()
			.then( function(data) {
			})
			.catch(function(error) {
				// Database connection error handling...
				//console.error("Error:", error);
			});
	}
	$scope.refreshTeams(); // call to refresh teams...

//.controller('matchCtrl', ["$scope", "$firebaseAuth"],
 // function($scope, $firebaseAuth) {


// skills match
	var getProfile = function(uid){
      var path= "profile/"+uid;
      var ref = firebase.database().ref(path);
      $scope.profile = $firebaseObject(ref);
      $scope.profile.$loaded()
        .catch(function(error) {
          // Database connection error handling...
          console.error("Error:", error);
        });
        return $scope.profile;
  };

	$scope.skillsmatch = function() {

	$scope.profile = getProfile($scope.userID);
      $scope.profile.$loaded()
      	.then(function(data){
		    if ($scope.profile.skills != ""){
	      		console.log("profile =",$scope.profile);

	 			for (teamindex=0; teamindex<$scope.teams.length; teamindex++)
	 			{
		      		console.log("team copied");
		 			var team = new Array();
		 			team[teamindex] = $scope.teams[teamindex];
		 			team[teamindex].score = 0;
					console.log("team_skills",$scope.teams[teamindex].wantedSkills);
		 			for (skillsindex=0; skillsindex< $scope.profile.skills.length; skillsindex++) {
			        	if (team[teamindex].wantedSkills){
			        		console.log("skills exists");
				        	if(team[teamindex].wantedSkills.indexOf($scope.profile.skills[skillsindex]) > -1) {
				        		console.log("if they are the same");
				        		team[teamindex].score++;}
			        	}
	        		}
	        	 console.log("team:",team);
		  	  	}
		      	$scope.teams = orderBy($scope.teams,'score',true);
		      	console.log("skillsmatch output",$scope.teams);
    		}
      	});
	};
// personality match

  $scope.personalitymatch = function() {

	$scope.profile = getProfile($scope.userID);
      $scope.profile.$loaded()
      	.then(function(data){

			if ($scope.profile.personality != ""){
				for (teamindex=0; teamindex<$scope.teams.length; teamindex++)
	 			{
	      			console.log("team copied");

	 				var team = new Array();
	 				team[teamindex] = $scope.teams[teamindex];
	 				team[teamindex].score = 0;

	        		if (team[teamindex].wantedPersonalities){
	        			console.log("personality exists");

	        			if(team[teamindex].wantedPersonalities.indexOf($scope.profile.personality) > -1) {
	        				console.log("if they are the same");
	        				team[teamindex].score++;
	        			}
	        		}
	        		console.log("team:",team);
	  	  		}
	      		$scope.teams = orderBy($scope.teams,'score',true);
	      		console.log("personalitymatch output",$scope.teams);
	    	}
	    });
};

// star match

$scope.starmatch = function() {

  	$scope.profile = getProfile($scope.userID);
      $scope.profile.$loaded()
      	.then(function(data){

			if ($scope.profile.star != ""){

    			for (teamindex=0; teamindex<$scope.teams.length; teamindex++)
 				{
		      		console.log("team copied");
		 			var team = new Array();
		 			team[teamindex] = $scope.teams[teamindex];
		 			team[teamindex].score = 0;

		        		if (team[teamindex].wantedHoroscopes){
		        			console.log("star exists");

		        			if(team[teamindex].wantedHoroscopes.indexOf($scope.profile.star) > -1) {
		        				console.log("if they are the same");
		        				team[teamindex].score++;
		        			}
		        		}
		        	console.log("team:",team);
		  	  	}

      			$scope.teams = orderBy($scope.teams,'score',true);
      			console.log("starmatch output",$scope.teams);
    		}
	    });
};

$scope.sizeText = 0;

$scope.largerthan = function(val){

	return function(item){
	if ( typeof item.teamMembers != "undefined" && typeof item.teamMembers != "null")
	{
		return item.currentTeamSize - item.teamMembers.length - item.currentTeamLeaderSize >= val;}
	else {
		return (item.currentTeamSize - item.currentTeamLeaderSize >= val);
	}
	}
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
