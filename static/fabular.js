var app = angular.module('fabular', ['ui.router']);
var chelevel = '';
var resultLink = [];

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
  $scope.Again = function(){
  	fabularService.getThings().success(function(data){
    $scope.currentIndex = 0;
    $scope.resultLink = [];
    $scope.numberResult = Math.floor(Math.random() * 3) + 1;
    $scope.item = data[Math.floor((Math.random() * 3))];
    $scope.questionArray = ['ask',$scope.item];
    // setting the values of arrays:
    if(chelevel === 1){
      $scope.optionsArray = data;
      $scope.expectedResult = [$scope.item];

    }else if (chelevel === 2){
      data.unshift('want');
      $scope.optionsArray = data;
      $scope.expectedResult = ['want', $scope.item];

      $scope.expectedResult = ['want',$scope.item];
    }else if (chelevel === 3){
      data.unshift('I','want');
      $scope.optionsArray = data;
      console.log($scope.optionsArray);
      $scope.expectedResult = ['I','want',$scope.item] ;
    }else if (chelevel === 4){
      data.unshift('i','want','1','2','3');
      $scope.questionArray = ['ask',$scope.numberResult.toString(),$scope.item];
      $scope.optionsArray = data;
      console.log($scope.optionsArray);
      $scope.expectedResult = ['i','want',$scope.numberResult.toString(),$scope.item] ;

    }else if (chelevel === 5){
      data.unshift('i','want','1','2','3');
      data.push('please');
      $scope.optionsArray = data;
      $scope.questionArray = ['ask',$scope.numberResult.toString(),$scope.item];
      $scope.expectedResult = ['i','want',$scope.numberResult.toString(),$scope.item,'please'] ;

    }
		$scope.clicked = function(option) {

			if (option === $scope.expectedResult[$scope.currentIndex]) {
				$scope.currentIndex += 1;
				$scope.resultLink.push(option);
				console.log("CurrentIn "+$scope.currentIndex);
				if(chelevel === 1 && $scope.currentIndex === 1){
          $scope.optionsArray = [];
        }
				if(chelevel === 2 && $scope.currentIndex === 2){
          $scope.optionsArray = [];
        }
        if(chelevel === 3 && $scope.currentIndex === 3){
          $scope.optionsArray = [];
        }
        if(chelevel === 4 && $scope.currentIndex === 4){
					$scope.optionsArray = [];
        }
				if((chelevel === 4 || chelevel === 5) && ($scope.currentIndex === 3 || $scope.currentIndex === 4)){
					$scope.optionsArray.splice(0,3);
				}
        if(chelevel === 5 && $scope.currentIndex === 5){
          $scope.optionsArray.pop();
        }
				if ($scope.currentIndex === 1 || $scope.currentIndex === 2){
				$scope.optionsArray.splice($scope.optionsArray.indexOf(option), 1);
			}
		}
      else {
				$scope.str = "$scope." + $scope.expectedResult[$scope.currentIndex];
        $scope.option = "animated wobble";
				console.log($scope.option);
			}
		};
  });
};
$scope.Again();
$scope.playAgain = function(){
$scope.Again();
};
});
