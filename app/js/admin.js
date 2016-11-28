$(document).ready(function(){

	$('#admin_page_controller').hide();
	$('#text_event_name').text("Error: Invalid event name ");
	var eventName = getURLParameter("q");
	if (eventName != null && eventName !== '' ) {
		$('#text_event_name').text("Event name: " + eventName);

	};

});

angular.module('teamform-admin-app', ['firebase'])
.controller('AdminCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$firebaseAuth', function($scope, $firebaseObject, $firebaseArray, $firebaseAuth) {

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



}]);
