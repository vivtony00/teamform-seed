describe("Test team.js", function() {

	//injection
 	var $controller, $firebaseAuth;;
	beforeEach(function(){
      module('teamform-team-app');
	  module(function($provide) {
		var user = {uid : "TEST1234ABC"};
		// Fake StoreService Implementation returning a promise
		$provide.value('$firebaseAuth',function(){
		return {
			//$createUserWithEmailAndPassword: function(username, password) {return {then: function(callback) {return callback(user);}};},
			//signInWithEmailAndPassword: function(username,password) {return {catch: function(callback) { return callback({message:null}); }};},
			//$signOut: function() { return user;},
			$onAuthStateChanged:function(funct) {funct(user);return user;},
			retrieveOnceFirebase: function(firebase, refPath, funct) {funct(data); return data;}
			//$signInWithPopup:function(way){return {catch: function(callback) { return callback({message:null}); }};}
			};
		});
    $provide.value('$firebaseObject', function(){
       return{
         $loaded: function(){return {then:function(funct){funct();return {catch: function(funct){funct(null);}};},catch: function(funct){funct("error");}};},
         $save: function(){return true;}

       }
    });
    $provide.value('$firebaseArray', function(){
       return{
         $loaded: function(){return {then:function(funct){funct();return {catch: function(funct){funct(null);}};},catch: function(funct){funct("error");}};},
         $save: function(){return true;}
       }
    });


		return null;
	  });
      inject(function(_$controller_, _$firebaseAuth_, _$firebaseArray_, _$firebaseObject_){
          $controller=_$controller_;
          $firebaseAuth=_$firebaseAuth_;
          $firebaseArray = _$firebaseArray_;
          $firebaseObject = _$firebaseObject_;
	  });

	});


    describe("Test functions in team.js", function(){
    	var user = {uid: "TEST1234ABC"};
    	var $scope, controller;
		//$scope = {};
	//	beforeEach(function() {
		$scope = {};
	//	   module('Simplift', 'firebase');
	//	});

		it("Load", function() {

			controller = $controller('TeamCtrl', {$scope: $scope});
			$scope.loadFunc();
		});

		it("Change team size", function() {//inject(function ($firebase) {
			//fireSync = $firebase(new Firebase('https://team-long-time-no-name.firebaseio.com'));
			$scope.loadFunc();
			var eventName = getURLParameter("q");
			var refPath = "events/" + eventName + "/admin";
			retrieveOnceFirebase(firebase, refPath);
			$scope.changeCurrentTeamSize(5);
		});

		it("Testing saving function without team defined", function() {

			$scope.saveFunc();
		});

		it("Testing saving function once team is defined", function() {
			$scope.param.teamName = "TeamExistent";
			$scope.saveFunc();
		});


		it("Testing add leader given defined teamMembers list containing the to-be-leader", function() {
			//$scope.auth.$onAuthStateChanged(firebaseUser);
			//$scope.processRequest("23882U23uJHF83jEE");

			$scope.param.teamName = "";
			$scope.saveFunc();
			$scope.param.teamMembers = ["IWantToBeLeader","IJustChill"];
			$scope.addLeader("IWantToBeLeader");
			$scope.saveFunc();
			expect($scope.param.teamLeaders).toContain("IWantToBeLeader");
			expect($scope.param.teamLeaders).not.toContain("IJustChill");
		});

		it("Testing add leader given defined teamMembers list without the to-be-leader", function() {

			$scope.param.teamMembers = ["IWantToBeLeader","IJustChill"];
			$scope.addLeader("Anonymous");
			$scope.saveFunc();
			expect($scope.param.teamLeaders).not.toContain("Anonymous");
		});

		it("Testing remove member given defined teamMembers list", function() {
			$scope.param.teamMembers = ["MemberOne"];
			$scope.removeMember("MemberOne");
			$scope.saveFunc();
			expect($scope.param.teamLeaders).not.toContain("MemberOne");
		});

		it("Testing remove member given defined teamMembers list without the member to be removed", function() {
			$scope.param.teamMembers = ["MemberOne", "MemberTwo"];
			$scope.removeMember("MemberZero");
			$scope.saveFunc();
			expect($scope.param.teamLeaders).not.toContain("MemberOne");
		});

		it("Testing process new member if the team still has space and member is new", function() {

			//event defined team size = (2, 10)
			//$scope.range.minTeamSize = 2;
			//$scope.range.maxTeamSize = 10;

			$scope.param.currentTeamSize = 8;
			$scope.param.teamMembers = ["MemberOne", "MemberTwo",  "MemberThree",  "MemberFour"];
			$scope.processRequest("MemberZero");
			$scope.saveFunc();
			expect($scope.param.teamMembers).toContain("MemberZero");
		});


		it("Testing process new member if the team still has space but member already exists", function() {

			//event defined team size = (2, 10)
			//$scope.range.minTeamSize = 2;
			//$scope.range.maxTeamSize = 10;

			$scope.param.currentTeamSize = 10;
			$scope.param.currentTeamLeaderSize = 1;
			$scope.param.teamMembers = ["MemberOne", "MemberTwo",  "MemberThree",  "MemberFour", "MemberFive"];
			$scope.param.teamLeaders = ["Leader"];
			$scope.processRequest("MemberThree");
			$scope.saveFunc();
			expect($scope.param.teamMembers).toContain("MemberThree");
		});

		it("Testing process new member if the team does not have space", function() {

			//event defined team size = (2, 10)
			//$scope.range.minTeamSize = 2;
			//$scope.range.maxTeamSize = 10;

			$scope.param.currentTeamSize = 6;
			$scope.param.currentTeamLeaderSize = 1;
			$scope.param.teamMembers = ["MemberOne", "MemberTwo",  "MemberThree",  "MemberFour", "MemberFive"];
			$scope.param.teamLeaders = ["Leader"];
			$scope.processRequest("NewMember");
			$scope.saveFunc();
			expect($scope.param.teamMembers).not.toContain("NewMember");
		});

		it("Testing refreshViewRequestsReceived()", function() {
			$scope.refreshViewRequestsReceived();
		});

		it("Testing remove leader if leader exists", function() {
			$scope.param.currentTeamLeaderSize = 2;
			$scope.param.teamLeaders = ["RemoveMe", "DontRemoveMe"];
			$scope.removeLeader("RemoveMe");
			$scope.saveFunc();
			expect($scope.param.teamLeaders).toEqual(["DontRemoveMe"]);
			expect($scope.param.currentTeamLeaderSize).toEqual(1);
		});

		it("Testing remove leader if leader doesn't exist", function() {
			$scope.param.currentTeamLeaderSize = 3;
			$scope.param.teamLeaders = ["DoYouDareToRemoveMe", "DontRemoveMe", "DoYouDareToRemoveMeEither"];
			$scope.removeLeader("IDontExist");
			$scope.saveFunc();
			expect($scope.param.teamLeaders).toEqual(["DoYouDareToRemoveMe", "DontRemoveMe", "DoYouDareToRemoveMeEither"]);
			expect($scope.param.currentTeamLeaderSize).toEqual(3);
		});

		it("Testing change leader if both leader and member exists", function() {
			$scope.param.currentTeamSize = 1000;
			$scope.param.teamMembers = ["MemberOne", "MemberTwo",  "MemberThree",  "MemberFour", "MemberFive"];
			$scope.param.currentTeamLeaderSize = 2;
			$scope.param.teamLeaders = ["Leader01", "Leader02"];
			$scope.changeLeader("Leader02", "MemberFive");
			$scope.saveFunc();
			expect($scope.param.teamLeaders).toEqual(["Leader01", "MemberFive"]);
			expect($scope.param.teamMembers).toEqual(["MemberOne", "MemberTwo",  "MemberThree",  "MemberFour", "Leader02"]);
			expect($scope.param.currentTeamLeaderSize).toEqual(2);
			expect($scope.param.teamLeaders.length).toEqual(2);
			expect($scope.param.teamMembers.length).toEqual(5);
		});

		it("Testing change leader if leader doesn't exist", function() {
			$scope.param.currentTeamSize = 1000;
			$scope.param.teamMembers = ["MemberOne", "MemberTwo",  "MemberThree",  "MemberFour", "MemberFive"];
			$scope.param.currentTeamLeaderSize = 2;
			$scope.param.teamLeaders = ["Leader01", "Leader02"];
			$scope.changeLeader("Leader10", "MemberFive");
			$scope.saveFunc();
			expect($scope.param.teamLeaders).toEqual(["Leader01", "Leader02"]);
			expect($scope.param.teamMembers).toEqual(["MemberOne", "MemberTwo",  "MemberThree",  "MemberFour", "MemberFive"]);
			expect($scope.param.currentTeamLeaderSize).toEqual(2);
			expect($scope.param.teamLeaders.length).toEqual(2);
			expect($scope.param.teamMembers.length).toEqual(5);
		});

		it("Testing change leader if member doesn't exist", function() {
			$scope.param.currentTeamSize = 1000;
			$scope.param.teamMembers = ["MemberOne", "MemberTwo",  "MemberThree",  "MemberFour", "MemberFive"];
			$scope.param.currentTeamLeaderSize = 2;
			$scope.param.teamLeaders = ["Leader01", "Leader02"];
			$scope.changeLeader("Leader01", "MemberTwenty");
			$scope.saveFunc();
			expect($scope.param.teamLeaders).toEqual(["Leader01", "Leader02"]);
			expect($scope.param.teamMembers).toEqual(["MemberOne", "MemberTwo",  "MemberThree",  "MemberFour", "MemberFive"]);
			expect($scope.param.currentTeamLeaderSize).toEqual(2);
			expect($scope.param.teamLeaders.length).toEqual(2);
			expect($scope.param.teamMembers.length).toEqual(5);
		});

		it("Testing add wanted skill", function(){
			$scope.addWantedSkill("JavaScript");
			expect($scope.param.wantedSkills).toContain("JavaScript");
		});

		it("Testing add wanted skill if skill already exists", function(){
			$scope.param.wantedSkills = ["C++"];
			$scope.addWantedSkill("C++");
			expect($scope.param.wantedSkills).toEqual(["C++"]);
		});

		it("Testing add wanted personality", function(){
			$scope.addWantedPersonalities("Smart");
			expect($scope.param.wantedPersonalities).toContain("Smart");
		});

		it("Testing add wanted personality if personality already exists", function(){
			$scope.param.wantedPersonalities = ["Clever", "Outgoing", "Leadership"];
			$scope.addWantedPersonalities("Outgoing");
			expect($scope.param.wantedPersonalities).toEqual(["Clever", "Outgoing", "Leadership"]);
		});

		it("Testing add wanted horoscope", function(){
			$scope.addWantedHoroscopes("Leo");
			expect($scope.param.wantedHoroscopes).toContain("Leo");
		});

		it("Testing add wanted horoscope if horoscope already exists", function(){
			$scope.param.wantedHoroscopes = ["Leo", "Aries"];
			$scope.addWantedHoroscopes("Aries");
			expect($scope.param.wantedHoroscopes).toEqual(["Leo", "Aries"]);
		});

		it("Testing remove wanted skill if skill exists", function(){
			$scope.param.wantedSkills = ["JavaScript", "C++", "C#", "Python", "php"];
			$scope.removeWantedSkill("JavaScript");
			expect($scope.param.wantedSkills).toEqual(["C++", "C#", "Python", "php"]);
		});

		it("Testing remove wanted skill if skill doesn't exist", function(){
			$scope.param.wantedSkills = ["JavaScript", "C++", "C#", "Python", "php"];
			$scope.removeWantedSkill("Ruby");
			expect($scope.param.wantedSkills).toEqual(["JavaScript", "C++", "C#", "Python", "php"]);
		});

		it("Testing remove wanted personality if personality already exists", function(){
			$scope.param.wantedPersonalities = ["Handsome", "Focused", "Quiet", "Friendly", "Sociable"];
			$scope.removeWantedPersonalities("Handsome");
			expect($scope.param.wantedPersonalities).toEqual(["Focused", "Quiet", "Friendly", "Sociable"]);
		});

		it("Testing remove wanted personality if personality doesn't exist", function(){
			$scope.param.wantedPersonalities = ["Handsome", "Focused", "Quiet", "Friendly", "Sociable"];
			$scope.removeWantedPersonalities("Cool");
			expect($scope.param.wantedPersonalities).toEqual(["Handsome", "Focused", "Quiet", "Friendly", "Sociable"]);
		});

		it("Testing remove wanted horoscope if horoscope already exists", function(){
			$scope.param.wantedHoroscopes = ["Leo", "Virgo", "Capricorn", "Sagittarius"];
			$scope.removeWantedHoroscopes("Leo");
			expect($scope.param.wantedHoroscopes).toEqual(["Virgo", "Capricorn", "Sagittarius"]);
		});

		it("Testing remove wanted horoscope if horoscope doesn't exist", function(){
			$scope.param.wantedHoroscopes = ["Leo", "Virgo", "Capricorn", "Sagittarius"];
			$scope.removeWantedHoroscopes("Libra");
			expect($scope.param.wantedHoroscopes).toEqual(["Leo", "Virgo", "Capricorn", "Sagittarius"]);
		});

		// it("Testing auto add", function(){
		// 	$scope.autoadd();
		// });

		it("Testing update scope", function(){
			$scope.updateScope("teamMembers", $scope.param.teamMembers);
		});

		it("Testing calculateNumPrettyGirls", function(){
			$scope.calculateNumPrettyGirls();
		});

		it("Testing advertise", function(){
			$scope.advertise();
		});

		it("Testing create time", function(){
      // spyOn($scope.profile, "$loaded").and.callThrough();
			$scope.createteam();
		});
    it("Test autoadd function", function(){
      // spyOn($scope.event, "$loaded").and.callThrough();
      $scope.autoadd();
    });



	});

});
