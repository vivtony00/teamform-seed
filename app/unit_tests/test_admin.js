describe('Test admin.js', function() {

  var $controller,$firebaseAuth;
  beforeEach(function(){
     module('teamform-admin-app');

     module(function($provide) {
       var user = {uid : "1234"};
       // Fake StoreService Implementation returning a promise

       $provide.value('$firebaseAuth',function(){
                return{
                      $onAuthStateChanged:function(funct) {funct(user);return user;},
                      };
           }
       );
       $provide.value('$firebaseObject', function(){
          return{
            $loaded: function(){return {then:function(funct){funct();return {catch: function(funct){funct(null);}};},catch: function(funct){funct("error");}};},
            $save: function(){return true;},
          }
       });
       $provide.value('$firebaseArray', function(){
          return{
            $loaded: function(){return {then:function(funct){funct();return {catch: function(funct){funct(null);}};},catch: function(funct){funct("error");}};},
            $save: function(){return true;},
          }
       });
       return null;
     });

     inject(
       function(_$controller_, _$firebaseAuth_, _$firebaseObject_,_$firebaseArray_){
         $controller= _$controller_;
         $firebaseAuth= _$firebaseAuth_;
         $firebaseObject = _$firebaseObject_;
       }
     );
   });

   describe('admin Controller Test', function() {
     var user = {uid : "1234"};
  	 var $scope ={};
  	 var controller;
     it ('admin controller instantiation', function(){
       controller = $controller('AdminCtrl', { $scope: $scope });
     });

    it ('test load event object', function(){
      spyOn($scope.param, "$loaded").and.callThrough();
      $scope.param.$loaded();//testing the case that $scope.param.maxTeamSize is undefined
      expect($scope.param.maxTeamSize).toEqual(10);
      expect($scope.param.minTeamSize).toEqual(1);
      $scope.param.$loaded();//testing the case that $scope.param.maxTeamSize is defined
    });

    it ('test load Arrays', function(){
      spyOn($scope.team , "$save").and.callThrough();
      // expect($scope.team).toEqual();
    });

    it ('test changeMinTeamSize function', function(){
      spyOn($scope.param, "$save").and.callThrough();
      $scope.param.minTeamSize=1;
      $scope.changeMinTeamSize(1);

      expect($scope.param.minTeamSize).toEqual(2);
    });
    it ('test changeMaxTeamSize function', function(){
      spyOn($scope.param, "$save").and.callThrough();
      $scope.param.maxTeamSize=10;
      $scope.changeMaxTeamSize(1);

      expect($scope.param.maxTeamSize).toEqual(11);
    });

    it ('test saveFunc function', function(){
      spyOn($scope.param, "$save").and.callThrough();
      // $scope.saveFunc();

      // expect($scope.param.$save).toHaveBeenCalled();
    });
   });
});
