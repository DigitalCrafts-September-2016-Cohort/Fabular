var app = angular.module('fabular', ['ui.router']);
var chelevel = '';
var resultLink = [];
var arrLength = 0;

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
    url : '/things/{level}',
    templateUrl : 'things.html',
    controller : 'fabularController'
  });
  // .state({
  //   name : 'settings',
  //   url : '/settings',
  //   templateUrl :'settings.html'
  // });
  $urlRouterProvider.otherwise('/things');
});

app.factory('fabularService',function($http){
  var service = {};
  service.getThings = function(){
    var url = '/things/{level}';
    return $http({
      method : 'GET',
      url : url
    });
  };

return service;
});


app.controller('fabularController', function($scope, $stateParams, $rootScope, $state, fabularService) {
  $scope.countWins = 0;
  chelevel = parseInt($stateParams.level);
  console.log('fabularController', typeof(chelevel));
  console.log(chelevel);
  $scope.Again = function(){
  fabularService.getThings().success(function(data){
    $scope.currentIndex = 0;
    $scope.numberResult = Math.floor(Math.random() * 3) + 1;
    $scope.item = data[Math.floor((Math.random() * 3))];
    $scope.questionArray = ['ask',$scope.item];
    // setting the values of arrays:
    if(chelevel === 1){
      $scope.optionsArray = data;
      $scope.expectedResult = [$scope.item];
			$scope.arrLength = $scope.expectedResult.length;
      console.log($scope.optionsArray);
      console.log($scope.expectedResult);
    }else if (chelevel === 2){
      data.unshift('want');
      $scope.optionsArray = data;
      $scope.expectedResult = ['want', $scope.item];
			$scope.arrLength = $scope.expectedResult.length;
			console.log("Length " + $scope.arrLength);
      console.log($scope.optionsArray);
      console.log($scope.expectedResult);
      $scope.expectedResult = ['want',$scope.item];
			console.log("length: " + $scope.expectedResult.length);
    }else if (chelevel === 3){
      data.unshift('I','want');
      $scope.optionsArray = data;
      $scope.expectedResult = ['I','want',$scope.item] ;
			$scope.arrLength = $scope.expectedResult.length;
      console.log($scope.optionsArray);
      console.log($scope.expectedResult);
    }else if (chelevel === 4){
      data.unshift('I','want', '1','2','3');
      $scope.optionsArray = data;
      $scope.expectedResult = ['I','want',$scope.numberResult,$scope.item] ;
			$scope.arrLength = $scope.expectedResult.length;
      console.log($scope.optionsArray);
      console.log($scope.expectedResult);
			console.log($scope.expectedResult.length);
    }else if (chelevel === 5){
      data.unshift('I','want','1','2','3');
      data.push('please');
      $scope.optionsArray =data;
      $scope.expectedResult = ['I','want',$scope.numberResult,$scope.item,'please'] ;
			$scope.arrLength = $scope.expectedResult.length;
      console.log($scope.optionsArray);
      console.log($scope.expectedResult);
    }
		$scope.clicked = function(option) {
			console.log('Value: ' + option);
			// console.log('Answer array ' + $scope.expectedResult);
			if (option === $scope.expectedResult[$scope.currentIndex]) {
				$scope.currentIndex += 1;
				resultLink.push(option);
				$scope.resultLink = resultLink;
				console.log("result: " + $scope.resultLink.length);
				$scope.optionsArray.splice($scope.optionsArray.indexOf(option), 1);
				// console.log($scope.resultLink);
				textToSpeak(option);
			} else {
				//Wrong item selected; Error correction

				console.log('Nope');
			}
		};

  });
};
$scope.Again();
$scope.playAgain = function(){
$scope.Again();
};
});
