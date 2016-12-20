var app = angular.module('fabular', ['ui.router']);

function textToSpeak(msg, idx) {
	if (typeof msg !== 'string') {
		throw new TypeError('Expected to say a string.');
	}
	var y = window.speechSynthesis;
	if (!y) {
		return console.warn('Your browser does not support `speechSynthesis` yet.');
	}
	var s = new SpeechSynthesisUtterance(msg);
	s.voice = y.getVoices()[idx || 0];
	y.speak(s);
}


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
    textToSpeak("Ask for "+$scope.item);
    $scope.things = data;
    $scope.sentence = '';
    $scope.expectedResult = ['I','want',$scope.item,'please'];
    console.log("currentIndex at first"+$scope.currentIndex);
    console.log($scope.expectedResult);
    console.log($scope.expectedResult[0]);
    $scope.firstClicked = function(item){
      if(item === $scope.expectedResult[0]){
        textToSpeak(item);
        $scope.sentence += item;
        $scope.currentIndex += 1;
        console.log($scope.currentIndex);
      }else{
        textToSpeak("Close, but not quite right. Let's try again");
      }
    };
    $scope.secondClicked = function(item){
      textToSpeak(item);
      $scope.sentence += " "+item;
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
        $scope.sentence += " "+$scope.item;
        console.log($scope.sentence);
        textToSpeak($scope.item);
        setTimeout(function(){ textToSpeak($scope.sentence); }, 1000);
      }
      else {
        textToSpeak(someThing+ "Close, but not quite right. Let's try again");
      }
    };
  });


});
