var app = angular.module('fabular', ['ui.router']);

app.config(function($stateProvider,$urlRouterProvider){
  $stateProvider
  .state({
    name : 'things',
    url : '/things',
    templateUrl : 'things.html',
    controller : 'fabularController'
  });
  $urlRouterProvider.otherwise('/things');
});
app.factory('fabularService',function($http){
  var service = {};
  service.getThings = function(){
    var url = '/things';
    return $http({
      method : 'GET',
      url : url
    });
  };

return service;
});

app.controller('fabularController', function($scope,fabularService) {
  fabularService.getThings().success(function(data){
    console.log(data);
    $scope.currentIndex = 0;
    $scope.item = data[Math.floor((Math.random() * 3))];
    $scope.things = data;
    $scope.expectedResult = ['I','want',$scope.item];
    console.log("currentIndex at first"+$scope.currentIndex);
    console.log($scope.expectedResult);
    console.log($scope.expectedResult[0]);
    $scope.firstClicked = function(item){
      console.log($scope.item);
      if(item === 'I'){
        console.log('check');
        $scope.currentIndex += 1;
        console.log($scope.currentIndex);
      }
      else {
        return;
      }
    };
    $scope.secondClicked = function(item){
      $scope.currentIndex += 1;
      console.log($scope.currentIndex);
    };
    $scope.thirdClicked = function(someThing) {
      console.log("click!");
      $scope.checkDisabled = function(item) {
        if (item !== $scope.item) {
          return true;
        }
      };
      if (someThing === $scope.item) {
        $scope.currentIndex += 1;
      }
      else {
        console.log("Not same");
      }
    };
  });


});
