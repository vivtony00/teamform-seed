$(document).ready(function()
{
	// $('#team_page_controller').hide();
	$('#text_event_name').text("Error: Invalid event name ");
	var eventName = getURLParameter("q");
	if (eventName != null && eventName !== '' )
	{
		$('#text_event_name').text("Event name: " + eventName);
	}
});

var app = angular.module('teamform-team-app', ['firebase'])
app.controller('TeamCtrl', ['$scope', '$firebaseObject', '$firebaseArray', "$firebaseAuth",
function($scope, $firebaseObject, $firebaseArray, $firebaseAuth)
{
	// Call Firebase initialization code defined in site.js
	initalizeFirebase();
   //your code

	$scope.auth=$firebaseAuth();
	$scope.auth.$onAuthStateChanged(function(firebaseUser) {
		if (firebaseUser) {
			$scope.uid = firebaseUser.uid;
		} else {
			console.log("Signed out");
		}
	});



	var refPath = "";
	var eventName = getURLParameter("q");

	$scope.param =
	{
		"teamName" : '',
		"teamMembers" : [],
		"teamLeaders" : [],
		"currentTeamSize" : 0,
		"currentTeamLeaderSize": 0,
		"numPrettyGirls": 0,
		"wantedSkills":[],
		"wantedPersonalities":[],
		"wantedHoroscopes": [],
		"desc": ''

	};


	refPath = "events/" + eventName + "/admin";
	retrieveOnceFirebase(firebase, refPath, function(data)
	{
		if ( data.child("param").val() != null )
		{
// >>>>>>> d594805f44704039d81c767a061af087b5ccd5f7
			$scope.range = data.child("param").val();
			$scope.param.currentTeamSize = parseInt(($scope.range.minTeamSize + $scope.range.maxTeamSize)/2);
			$scope.$apply(); // force to refresh
			$('#team_page_controller').show(); // show UI

		}
	});


	refPath = "events/" + eventName + "/member";
	$scope.member = [];
	$scope.member = $firebaseArray(firebase.database().ref(refPath));


	refPath = "events/" + eventName + "/team";

	$scope.team = [];
	$scope.team = $firebaseArray(firebase.database().ref(refPath));


	$scope.requests = [];
	$scope.refreshViewRequestsReceived = function()
	{
		//$scope.test = "";
		$scope.requests = [];
		var teamID = $.trim( $scope.param.teamName );

		$.each($scope.member, function(i,obj) {
			//$scope.test += i + " " + val;
			//$scope.test += obj.$id + " " ;

			var userID = obj.$id;
			// var userSex = obj.sex;
			if ( typeof obj.selection != "undefined"  && obj.selection.indexOf(teamID) > -1 ) {
				//$scope.test += userID + " " ;

				$scope.requests.push(userID);
			}
		});

		$scope.$apply();
	}


	// set team size
	$scope.changeCurrentTeamSize = function(delta)
	{
		var newVal = $scope.param.currentTeamSize + delta;
		if (newVal >= $scope.range.minTeamSize && newVal <= $scope.range.maxTeamSize ) {
			$scope.param.currentTeamSize = newVal;
		}
	}

	$scope.saveFunc = function()
	{
		var teamID = $.trim( $scope.param.teamName );

		if ( teamID !== '' ) {
			var myUID;
			//get my user uid
			firebase.auth().onAuthStateChanged(function(user) {
			 	if (user) {
			 		myUID = user.uid;
   			 		// User is signed in. Get the UID.
  				} else {
  					  	console.log("Please log-in first.");
  					  	return;
    				// No user is signed in.
  				}
			});

			//the set of data to be updated
			var newData = {
				'teamName': $scope.param.teamName,
				'teamMembers': $scope.param.teamMembers,
				'teamLeaders': $scope.param.teamLeaders,
				'currentTeamSize': $scope.param.currentTeamSize,
				'currentTeamLeaderSize': $scope.param.currentTeamLeaderSize,
				'numPrettyGirls': $scope.param.numPrettyGirls,
				'wantedSkills': $scope.param.wantedSkills,
				'wantedPersonalities': $scope.param.wantedPersonalities,
				'wantedHoroscopes': $scope.param.wantedHoroscopes,
				'desc': $scope.param.desc
			};

			var refPath = "events/" + getURLParameter("q") + "/team/" + teamID;
			var ref = firebase.database().ref(refPath);

// >>>>>>> d594805f44704039d81c767a061af087b5ccd5f7
			// for each team members, clear the selection in /[eventName]/team/

			$.each($scope.param.teamMembers, function(i,obj){
				//$scope.test += obj;
				var rec = $scope.member.$getRecord(obj);
				rec.selection = [];
				$scope.member.$save(rec);

			});

			//update data in Firebase
			ref.set(newData).then(function() {
   				console.log('Synchronization succeeded');
  			})
			.catch(function(error) {
   				console.log('Synchronization failed');
 			});
				// console.log("Success..");

				// Finally, go back to the front-end
				// window.location.href= "index.html";
			//});
		}
	}

	$scope.loadFunc = function()
	{
		var teamID = $.trim( $scope.param.teamName );
		var eventName = getURLParameter("q");
		var refPath = "/events/" + eventName + "/team/" + teamID;
		retrieveOnceFirebase(firebase, refPath, function(data)
		{
			// $scope.updateScope("teamMembers", teamMembers);
			// $scope.updateScope("teamLeaders", teamLeaders);
			// $scope.updateScope("currentTeamSize", currentTeamSize);
			// $scope.updateScope("currentTeamLeaderSize", currentTeamLeaderSize);
			// $scope.updateScope("numPrettyGirls", numPrettyGirls);
			// $scope.updateScope("wantedSkills", wantedSkills);
			// $scope.updateScope("wantedPersonalities", wantedPersonalities);
			// $scope.updateScope("wantedHoroscopes", wantedHoroscopes);
			//
			// $scope.refreshViewRequestsReceived();
			//
			//
			// $scope.$apply(); // force to refresh

			if ( data.child("teamMembers").val() != null ) {
			$scope.param.teamMembers = data.child("teamMembers").val();
			}
			if ( data.child("currentTeamLeaderSize").val() != null ) {
				$scope.param.currentTeamLeaderSize = data.child("currentTeamLeaderSize").val();
			}
			if ( data.child("numPrettyGirls").val() != null ) {
				$scope.param.numPrettyGirls = data.child("numPrettyGirls").val();
			}
			if ( data.child("teamLeaders").val() != null ) {
				$scope.param.teamLeaders = data.child("teamLeaders").val();
			}
			if ( data.child("wantedHoroscopes").val() != null ) {
				$scope.param.wantedHoroscopes = data.child("wantedHoroscopes").val();
			}
			if ( data.child("wantedPersonalities").val() != null ) {
				$scope.param.wantedPersonalities = data.child("wantedPersonalities").val();
			}

			if ( data.child("desc").val() != null ) {
				$scope.param.desc = data.child("desc").val();
			}
			//console.log(refPath, data);
			//console.log(data.child("currentTeamSize"));
			if ( data.child("currentTeamSize").val() != null ) {
				console.log("has a team");
				$scope.param.currentTeamSize = data.child("currentTeamSize").val();
				$scope.refreshViewRequestsReceived();
			}

			$scope.$apply(); // force to refresh
		});

	}

	$scope.updateScope = function(entryString, parameter)
	{
			if ( data.child(entryString).val() != null ) {
				$scope.param.parameter = data.child(entryString).val();
			}
	}

	$scope.processRequest = function(r)
	{
			// console.log($scope.param.teamMembers);
		//$scope.test = "processRequest: " + r;
		if( $scope.param.teamMembers.indexOf(r) < 0 &&
			$scope.param.teamMembers.length + $scope.param.currentTeamLeaderSize < $scope.param.currentTeamSize  )
		{
			// Not exists, and the current number of team member is less than the preferred team size

			$scope.param.teamMembers.push(r);

			$scope.saveFunc();
			$scope.refreshViewRequestsReceived();
		}
	}


	$scope.removeMember = function(member)
	{
		var index = $scope.param.teamMembers.indexOf(member);
		if ( index > -1 )
		{
			$scope.param.teamMembers.splice(index, 1); // remove that item
			$scope.saveFunc();
		}
	}

	$scope.changeLeader = function(leaderToBeSwapped = null, memberToBeSwapped = null)
	{
		var indexLeader = $scope.param.teamLeaders.indexOf(leaderToBeSwapped);
		var indexMember = $scope.param.teamMembers.indexOf(memberToBeSwapped);

		if ( indexLeader > -1 && indexMember > -1) {
			$scope.param.teamLeaders.splice(indexLeader, 1);
			$scope.param.teamMembers.splice(indexMember, 1);
			$scope.param.teamLeaders.push(memberToBeSwapped);
			$scope.param.teamMembers.push(leaderToBeSwapped);

			$scope.saveFunc();
		}
	}

	$scope.addLeader = function(member = null)
	{
		var indexMember = $scope.param.teamMembers.indexOf(member);
		if ( indexMember > -1 )
		{
			$scope.param.teamMembers.splice(indexMember, 1);
			$scope.param.teamLeaders.push(member);
			$scope.param.currentTeamLeaderSize++;

			$scope.saveFunc();
		}
	}

	$scope.removeLeader = function(leader = null)
	{
		var indexLeader = $scope.param.teamLeaders.indexOf(leader);
		if ( indexLeader > -1 )
		{
			$scope.param.teamLeaders.splice(indexLeader, 1);
			$scope.param.teamMembers.push(leader);
			$scope.param.currentTeamLeaderSize--;

			$scope.saveFunc();
		}
	}

	$scope.addWantedSkill = function(skillString = null)
	{
			$scope.addString(skillString, $scope.param.wantedSkills);
	}

	$scope.addWantedPersonalities = function(personalityString = null)
	{
			$scope.addString(personalityString, $scope.param.wantedPersonalities);
	}

	$scope.addWantedHoroscopes = function(horoscopeString = null)
	{
			$scope.addString(horoscopeString, $scope.param.wantedHoroscopes);
	}

	$scope.addString = function(stringToBeAdded, parameter)
	{
		var indexString = parameter.indexOf(stringToBeAdded);
		if (indexString < 0)
		{
			parameter.push(stringToBeAdded);
			$scope.saveFunc();
		}
	}

	$scope.changeDesc = function(desc)
	{
		$scope.desc = desc;
		$scope.saveFunc();
	}

	$scope.removeWantedSkill = function(skillString = null)
	{
		$scope.removeString(skillString, $scope.param.wantedSkills);
	}

	$scope.removeWantedPersonalities = function(personalityString = null)
	{
		$scope.removeString(personalityString, $scope.param.wantedPersonalities);
	}

	$scope.removeWantedHoroscopes = function(horoscopeString = null)
	{
		$scope.removeString(horoscopeString, $scope.param.wantedHoroscopes);
	}

	$scope.removeString = function(stringToBeRemoved, parameter)
	{
		var indexString = parameter.indexOf(stringToBeRemoved);
		if (indexString > -1)
		{
			parameter.splice(indexString, 1);
			$scope.saveFunc();
		}
	}

	$scope.calculateNumPrettyGirls = function()
	{
		var count = 0;

		//get 'profile' ref
        var userDataRef = firebase.database().ref("profile");
        //load gender using uid from profile
        userDataRef.once("value").then(function(snapshot)
        {
			for(var i = 0; i < $scope.param.teamMembers.length; i++)
			{
				if(snapshot.val().teamMembers[i].gender == 'F' || snapshot.val().teamMembers[i].gender == 'f')
				{
					count ++;
				}
			}
			for(var i = 0; i < $scope.param.teamLeaders.length; i++)
			{
				if(snapshot.val().teamLeaders[i].gender == 'F' || $scope.param.teamLeaders[i].gender == 'f')
				{
					count ++;
				}
			}
		});
		$scope.param.numPrettyGirls = count;
		$scope.saveFunc();
	}
	$scope.autoadd = function(){
		  var eventName = "/events/"+ getURLParameter("q") +"/member/";
		  console.log(eventName);
		  var ref = firebase.database().ref(eventName);
			// change event to global variable temporarily
		  var event = $firebaseArray(ref);
		  console.log(event);

		  var teamPath ="/events/"+ getURLParameter("q") + "/team/";
		  var teams = firebase.database().ref(teamPath);
		  var team = $firebaseArray(teams);
// need to test
		// $scope.event = event;
		// event = $scope.event;
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

	$scope.advertise = function() {


		var adverID = $.trim( $scope.param.title );


		if ( adverID !== '' && $scope.param.advertisement !== "") {

			var newData = {
				'content': $scope.param.advertisement
			};

			var refPath = "/events/"+getURLParameter("q") + "/advertisement/" + adverID;
			var ref = firebase.database().ref(refPath);

			ref.set(newData, function(){
				// complete call back
				//alert("data pushed...");

				// Finally, go back to the front-end
				window.location.href= "index.html";
			});
		}
	}

	$scope.createteam = function(){

		if($scope.uid){}else{console.log("log in please");return;}

		console.log(
			$scope.member.map(function(e){return e.$id;}).indexOf($scope.uid)
		);
		console.log($scope.member);

		var refPath = "/events/"+getURLParameter("q") + "/member/"+ $scope.uid;
		var ref = firebase.database().ref(refPath);
		$scope.profile = getProfile($scope.uid);
		$scope.profile.$loaded().then(function(data){
			if(typeof $scope.profile["name"] == "undefined"){console.error("Please sign in");return;}
			if($scope.member.map(function(e){return e.$id;}).indexOf($scope.uid) <= -1){
			var newData = {
				'name': $scope.profile["name"],
			};

			ref.set(newData, function(){});
			$scope.param.currentTeamLeaderSize = 1;
			$scope.param.teamLeaders.push($scope.uid);
			$scope.saveFunc();
			}
		});
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
