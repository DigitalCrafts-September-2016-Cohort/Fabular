var app = angular.module('fabular', []);
var chelevel = 1;
var resultLink = [];
//Holds reward items in basket array
var basket = [];

//Function for voice
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

//States
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

//Factory
app.factory('fabularService',function($http){
	var service = {};

	service.getThings = function(category){
		console.log(category);
		var url = '/things/' + category;
		return $http({
			method : 'GET',
			url : url,
			category: category,
		});
	};
	return service;
});

//Controllers

app.controller('fabularController', function($scope, $timeout,$stateParams, $rootScope, $state, fabularService) {
	var i_obj = {"name" : "i", "wobble" : "false"};
	var ask_obj = {"name" : "askfor", "wobble" : "false"};
	var want_obj = {"name" : "want", "wobble" : "false"};
	var obj_1 = {"name" : "1", "wobble" : "false"};
	var obj_2 = {"name" : "2", "wobble" : "false"};
	var obj_3 = {"name" : "3", "wobble" : "false"};
	var r;
	$scope.levels = [1,2,3,4,5];
	$scope.clickedStatement = false;
	$scope.settings = 'noshow';
	var inBasket = [];
	// var category = $scope.category;
	$scope.category = 'animals';
	$scope.clickedBasket = function() {
		if($scope.clickedStatement === false){
      $scope.clickedStatement = true;
		inBasket.sort();
		var item = null;
		var cnt = 0;
		for (var i = 0; i < inBasket.length + 1; i++) {
		    if (inBasket[i] != item) {
		        if (cnt > 0) {
		            console.log(item + ': ' + cnt + ' times');
		        }
		        item = inBasket[i];
		        cnt = 1;
		    } else {
		        cnt++;
		    }
		  }
		} else if($scope.clickedStatement === true) {
			$scope.clickedStatement = false;
		}
	};

	//Holds current winning rounds
	$scope.countWins = 0;
	//Game wrapped in play again function
	$scope.levelChange = function(value){
		chelevel = parseInt(value);
		$scope.level = value;
		$scope.settings = 'noshow';
		$scope.Again();
	};
	$scope.setCategory = function(value){
		$scope.category = value;
		console.log(value);
		$scope.settings = 'noshow';
		$scope.Again();

	};
	$scope.setSettings = function(){
		$scope.settings = 'show';
	};

  $scope.Again = function(){
		$scope.resultLink = [];
  	fabularService.getThings($scope.category).success(function(data){
			$scope.currentIndex = 0;
			//Selects random number through 3 for levels with counting
	    r = (Math.floor(Math.random() * 3) + 1).toString();
			//Converts random number into an object
			var r_num = {"name" : r, "wobble" : "false"};
			//Selects single item from data array using random index number
	    $scope.item = data[Math.floor((Math.random() * 3))];
			console.log($scope.item);
			//Builds question array with 'ask' image and $scope.item
	    $scope.questionArray = [ask_obj,$scope.item];
	    //Sets the values of options arrays and expected result arrays depending on level selected:
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
	      // console.log($scope.optionsArray);
				console.log($scope.resultLink);

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
				// textToSpeak(value.name);
			});
		});
	};
	// popup tutorial
		$scope.tutorStatement = false;
		$scope.tutorial = function() {
			$scope.tutorStatement = true;
			if($scope.tutorStatement === true) {
				var tour = {
				  id: "hello-hopscotch-a",
				  steps: [{
				    title: "Prompt",
				    content: "The student is given a prompt in order to request an item",
				    target: "btn-menu",
				    placement: "left",
						yOffset : 100,
				    xOffset: 480,
				    onShow: function() {
							$(".prompt").removeClass("animated");
							$(".prompt").addClass("z-one");
							$(".promptPic").addClass("highLight");
				      document.getElementById("btn-menu").style.zIndex = 9999999999999;
							// document.getElementById("entire").style.zIndex = 1;
							console.log("On 1");
						},
				    onNext: function() {
							$(".prompt").removeClass("highLight");
							$(".prompt").addClass("animated");
							$(".prompt").removeClass("z-one");
				      document.getElementById("btn-menu").style.zIndex = 0;
							// document.getElementById("entire").style.zIndex = 1;
							console.log("Off 1");
				    }
				  }, {
				    title: "Options",
				    content: "The field of options is provided with immediate error correction upon a wrong selection",
				    target: "btn-user",
				    placement: "bottom",
				    xOffset: 450, // this will set the left - right
				    yOffset: 450,
				    arrowOffset: 130,
				    onShow: function() {
							$(".options").addClass("highLight");
							$(".options").addClass("animated");
							$(".options").addClass("z-one");
				      document.getElementById("btn-user").style.zIndex = 9999999999999;
							console.log("On 3");
				    },
				    onNext: function() {
							$(".options").removeClass("highLight");
							$(".options").addClass("animated");
							$(".options").removeClass("z-one");
							document.getElementById("btn-user").style.zIndex = 0;
							console.log("Off 3");
				    }
				  },{
				    title: "Settings",
				    content: "Control prompting levels, switch categories, and learn about the Fabular Team in Settings Menu.",
				    target: "btn-system",
				    placement: "bottom",
				    xOffset: 850,
						yOffset: 100, // this will set the left - right
				    arrowOffset: 260,
				    onShow: function() {
							$(".menu").addClass("z-one");
				      document.getElementById("btn-system").style.zIndex = 9999999999999;
							console.log("On 2");
				    },
				    onNext: function() {
							$(".menu").removeClass("z-one");
				      document.getElementById("btn-system").style.zIndex = 0;
							console.log("Off 2");
				    }
				  },{
				    title: "Rewards",
				    content: "For every correct request, the items are accumulated in the rewards basket.  Students may click on the basket to review their rewards at any time.",
				    target: "btn-users",
				    placement: "top",
				    xOffset: 100, // this will set the left - right
				    yOffset: 450,
				    arrowOffset: 130,
				    onShow: function() {
							$(".basket").addClass("highLight");
							$(".basket").removeClass("animated");
							$(".basket").addClass("z-one");
				      document.getElementById("btn-users").style.zIndex = 9999999999999;
							console.log("On 4");
				    },
				    onNext: function() {
							// $(".options").addClass("animated");
				      document.getElementById("btn-users").style.zIndex = 0;
							console.log("Off 4");
				    }
				  }],
				  onStart: function() {
				    document.getElementById("mask").className = "mask masked";
						// $(".animated").removeClass("animated");
						// $(".animated").addClass("animated");

						console.log("on");
				  },
				  onEnd: function() {
				    document.getElementById("mask").className = "mask";
						// $(".options").addClass("animated");
						console.log("off");
					}
				};

				hopscotch.startTour(tour, 0);
		}
	};
	//Click function
	$scope.clicked = function(option) {
		//Handles correct click events
		if (option.name === $scope.expectedResult[$scope.currentIndex].name) {
			$scope.currentIndex += 1;
			// textToSpeak(option.name);
			$scope.resultLink.push(option);
			if(chelevel === 1 && $scope.currentIndex === 1){
        $scope.optionsArray = [];
      }
			if(chelevel === 2 && $scope.currentIndex === 2){
        $scope.optionsArray = [];
      }
      if(chelevel === 3 && $scope.currentIndex === 3){
        $scope.optionsArray = [];
				inBasket.push($scope.resultLink[$scope.currentIndex -1].name);
      }
      if(chelevel === 4 && $scope.currentIndex === 4){
				$scope.optionsArray = [];
      }
			//Split levels because of splice in 153
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
			//Handles incorrect click events with verbal prompt for correct option
			// textToSpeak("Please press  "+$scope.expectedResult[$scope.currentIndex].name);
			var obj = $scope.optionsArray.filter(function(option){
					return option.name === $scope.expectedResult[$scope.currentIndex].name;
				});
				//Wobbles correct button
				obj[0].wobble = true;
				$timeout(function () {
					$scope.optionsArray.forEach(function(a){
						a.wobble = false;
					});
				}, 1000);
		}
		//When user creates correct sentence
		//When user creates correct sentence
		if($scope.expectedResult.length === $scope.resultLink.length){
			//textToSpeak function reads the sentence
			$scope.resultLink.forEach(function(value){
				// textToSpeak(value.name);
				});
			//Pushes 'x' number of prompt items into reward basket for levels 4 and 5
			if(chelevel === 5){
				for(let j=0;j<r;j++){
					inBasket.push($scope.resultLink[$scope.currentIndex -2].name);
				}
			}else if(chelevel === 4) {
				for(let j=0;j<r;j++){
					inBasket.push($scope.resultLink[$scope.currentIndex -1].name);
				}
		//Pushes prompt item into reward basket
			}else{
				inBasket.push($scope.resultLink[$scope.currentIndex -1].name);
			}
		}
		// textToSpeak("Good Job, Would you like to play again?");
		$scope.basket = inBasket;
	};

	$scope.Again();
	$scope.playAgain = function(){
		$scope.resultLink = [];
		$scope.Again();
	};
});
