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


app.controller('fabularController', function($scope, $timeout,$stateParams, $rootScope, $state, fabularService) {
	var i_obj = {"name" : "I", "wobble" : "false"};
	var ask_obj = {"name" : "askfor", "wobble" : "false"};
	var want_obj = {"name" : "want", "wobble" : "false"};
	var obj_1 = {"name" : "1", "wobble" : "false"};
	var obj_2 = {"name" : "2", "wobble" : "false"};
	var obj_3 = {"name" : "3", "wobble" : "false"};
	$scope.countWins = 0;
	$scope.bascket = [];
  chelevel = parseInt($stateParams.level);
  $scope.Again = function(){
  	fabularService.getThings().success(function(data){
    $scope.currentIndex = 0;
    $scope.resultLink = [];
    var r = (Math.floor(Math.random() * 3) + 1).toString();
		var r_num = {"name" : r, "wobble" : "false"};
    $scope.item = data[Math.floor((Math.random() * 3))];
    $scope.questionArray = [ask_obj,$scope.item];
    // setting the values of arrays:
    if(chelevel === 1){
      $scope.optionsArray = data;
      $scope.expectedResult = [$scope.item];

    }else if (chelevel === 2){
      data.unshift(want_obj);
      $scope.optionsArray = data;
      $scope.expectedResult = [want_obj, $scope.item];
      $scope.expectedResult = [want_obj,$scope.item];
    }else if (chelevel === 3){
      data.unshift(i_obj,want_obj);
      $scope.optionsArray = data;
      console.log($scope.optionsArray);
      $scope.expectedResult = [i_obj,want_obj,$scope.item] ;
    }else if (chelevel === 4){
      data.unshift(i_obj,want_obj,obj_1,obj_2,obj_3);
      $scope.questionArray = [ask_obj,r_num,$scope.item];
      $scope.optionsArray = data;
      $scope.expectedResult = [i_obj,want_obj,r_num,$scope.item] ;
    }else if (chelevel === 5){
			please_obj = {"name" : "please", "wobble" : "false"};
      data.unshift(i_obj,want_obj,obj_1,obj_2,obj_3);
      data.push(please_obj);
      $scope.optionsArray = data;
      $scope.questionArray = [ask_obj,r_num,$scope.item];
      $scope.expectedResult = [i_obj,want_obj,r_num,$scope.item,please_obj] ;

    }
		$scope.questionArray.forEach(function(value){
			textToSpeak(value.name);
		});
		$scope.clicked = function(option) {
			if (option.name === $scope.expectedResult[$scope.currentIndex].name) {
				$scope.currentIndex += 1;
				textToSpeak(option.name);
				$scope.resultLink.push(option);
				console.log($scope.optionsArray);
				if(chelevel === 1 && $scope.currentIndex === 1){
          $scope.optionsArray = [];
					console.log($scope.optionsArray);
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
				textToSpeak("Please press  "+$scope.expectedResult[$scope.currentIndex].name);
				var obj = $scope.optionsArray.filter(function(option){
						return option.name === $scope.expectedResult[$scope.currentIndex].name;
					});
					obj[0].wobble = true;
					$timeout(function () {
						$scope.optionsArray.forEach(function(a){
							a.wobble = false;
						});
					}, 1000);
			}
			if($scope.expectedResult.length === $scope.resultLink.length){
				$scope.resultLink.forEach(function(value){
					textToSpeak(value.name);
				});
				textToSpeak("Good Job, Would you like to play again?");
			}
		};
  });
};
$scope.Again();
$scope.playAgain = function(){
$scope.Again();
};
});
