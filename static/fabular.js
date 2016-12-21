var app = angular.module('fabular', ['ui.router']);
var chelevel = '';
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
  })
  .state({
    name : 'settings',
    url : '/settings',
    templateUrl :'settings.html'
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


app.controller('fabularController', function($scope, $rootScope, $state, fabularService) {
  $scope.countWins = 0;
  $scope.set = function(){
    chelevel = $scope.level;
    $state.go('things');
  };
  $scope.Again = function(){
  fabularService.getThings().success(function(data){
    $scope.currentIndex = 0;
    $scope.numberResult = Math.floor(Math.random() * 5) + 1;
    $scope.item = data[Math.floor((Math.random() * 3))];
    $scope.questionArray = ['askfor',$scope.item];
    $scope.optionsArray = [];
    // setting the values of arrays:
    if(chelevel === "1"){
      $scope.optionsArray = $scope.optionsArray.push(data);
      $scope.expectedResult = ['$scope.item'];
      console.log($scope.optionsArray);
      console.log($scope.expectedResult);
    }else if (chelevel === "2"){
      data.unshift('want');
      $scope.optionsArray.push(data);
      console.log($scope.optionsArray);
      console.log($scope.expectedResult);
      $scope.expectedResult = ['want',$scope.item];
    }else if (chelevel === "3"){
      data.unshift('I','want');
      $scope.optionsArray.push(data);
      $scope.expectedResult = ['I','want',$scope.item] ;
      console.log($scope.optionsArray);
      console.log($scope.expectedResult);
    }else if (chelevel === "4"){
      data.unshift('I','want','2','3','4','5');
      $scope.optionsArray.push(data);
      $scope.expectedResult = ['I','want',$scope.numberResult,$scope.item] ;
      console.log($scope.optionsArray);
      console.log($scope.expectedResult);
    }else if (chelevel === "5"){
      data.unshift('I','want','2','3','4','5');
      data.push('please');
      $scope.optionsArray.push(data);
      $scope.expectedResult = ['I','want',$scope.numberResult,$scope.item,'please'] ;
      console.log($scope.optionsArray);
      console.log($scope.expectedResult);
    }


    // textToSpeak("Ask for "+$scope.item);
    $scope.things = data;
    $scope.sentence = '';
    $scope.expectedResult = ['I','want',$scope.item,'please'];
    $scope.shakeImg = function(){
    };

    $scope.firstClicked = function(item){
      console.log($scope.optionsArray);
      console.log($scope.expectedResult);

      console.log($scope.currentIndex);
      if($scope.currentIndex === 0){
        console.log('first click');
        if(item === $scope.expectedResult[0]){
          textToSpeak(item);
          $scope.sentence += item;
          $scope.currentIndex += 1;
          console.log($scope.currentIndex);
        } else {
          console.log('Entered else');
          textToSpeak("Close, but not quite right. Let's try again");
        }
      }
    };
    $scope.secondClicked = function(item){
      if($scope.currentIndex === 1){
        console.log('second click');
        if(item === $scope.expectedResult[1]){
          textToSpeak(item);
          $scope.sentence += " "+item;
          $scope.currentIndex += 1;
          console.log($scope.currentIndex);
        } else {
          textToSpeak("Close, but not quite right. Let's try again");
        }
      }

    };
    $scope.thirdClicked = function(someThing) {
      if($scope.currentIndex === 2){
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
        // setTimeout(function(){ textToSpeak($scope.sentence); }, 1000);
        setTimeout(function(){
          // textToSpeak("Good job on asking for"+$scope.item);
          $scope.countWins +=1;
          console.log("Wins: "+$scope.countWins);}, 1200);
        }
      else {
        textToSpeak(someThing+ "Close, but not quite right. Let's try again");
      }
    }
  };
  });
};
$scope.Again();
$scope.playAgain = function(){
$scope.Again();
};
});
