describe("Test member.js", function() {

	//injection
 	var $controller, $firebaseAuth,$firebaseObject;
	beforeEach(function(){
      module('teamform-member-app');
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
            $save: function(){return true;},

          }
       });
		return null;
	  });
      inject(function(_$controller_, _$firebaseAuth_,_$firebaseObject_){
          $controller=_$controller_;
          $firebaseAuth=_$firebaseAuth_;
		  $firebaseObject=_$firebaseObject_;
	  });
	
	});
	
    
    describe("Test functions in member.js", function(){
    	var user = {uid: "TEST1234ABC"};
		var $scope={};
    	var  controller;
		// $scope = {};
	//	beforeEach(function() {
	
	//	   module('Simplift', 'firebase');
	//	});
		
		it("Load", function() {	 
			
			controller = $controller('MemberCtrl', {$scope: $scope});
			$scope.userID = '1234';
			$scope.loadFunc();
		});
		
	
		it("Testing saving function without member defined", function() {	 
			
			$scope.saveFunc();
		});
		
		it("Testing saving function for existing member", function() {	 
			$scope.userID = "Exist";
			$scope.userName = "Exist";
			$scope.saveFunc();
		});
		
			
		it("Testing will advertise will be loaded from firebase", function() {	
			//$scope.auth.$onAuthStateChanged(firebaseUser);
			//$scope.processRequest("23882U23uJHF83jEE");
			spyOn($scope.advertisement, "$loaded").and.callThrough();
			$scope.refreshAds();
			
		});
		
		it("test autoadd can remove one's selection", function() {	

			$scope.selection=[];
			$scope.team=[{$id:'Foo'}];
			$scope.selectall();
			expect($scope.team.length).toBeGreaterThan(0);
		});
		
		it("Testing will team be loaded from firebase", function() {
			// spyOn($scope.teams, "$loaded").and.callThrough();			
			$scope.refreshTeams();
		});
		
		it("Testing get profile", function() {	
			// spyOn($scope.profile, "$loaded").and.callThrough();
			$scope.getProfile();
		});
		
		it("Testing skillsmatch", function() {
			
			//event defined team size = (2, 10)
			//$scope.range.minTeamSize = 2;
			//$scope.range.maxTeamSize = 10;

			// spyOn($scope.profile, "$loaded").and.callThrough();
			$scope.skillsmatch();
			
		});
			
			
		it("Testing personality search", function() {
			
			//event defined team size = (2, 10)
			//$scope.range.minTeamSize = 2;
			//$scope.range.maxTeamSize = 10;

			// spyOn($scope.profile, "$loaded").and.callThrough();
			$scope.personalitymatch();
		});
		
		it("Testing star match", function() {
			
			//event defined team size = (2, 10)
			//$scope.range.minTeamSize = 2;
			//$scope.range.maxTeamSize = 10;

			// spyOn($scope.profile, "$loaded").and.callThrough();
			$scope.starmatch();
			
		});
			
		it("Testing largerthan", function() {
			var item ={};
			item.teamMembers = [{id:'hi'}];
			item.currentTeamSize = 10;
			item.currentTeamLeaderSize = 3;
			var val = 0;
			$scope.largerthan(val);
			expect(val).toBeLessThan(7);
		});
		
		
	});
	
});