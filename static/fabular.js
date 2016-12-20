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
// fruits = ['apple','banana','berries','cranberries','grapes','kiwi','pineapple','strawberry'];
fabularService.getThings().success(function(data){
  console.log(data);
  $scope.item = data[Math.floor((Math.random() * 3))];
  $scope.things = data;
});

});
