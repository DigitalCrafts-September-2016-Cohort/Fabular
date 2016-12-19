var app = angular.module('fabular', []);
app.controller('fabularController', function($scope, $timeout, $interval) {

fruits = ['apple','banana','berries','cranberries','grapes','kiwi','pineapple','strawberry'];

shuffle(fruits);
$scope.randomfruit = fruits[3];
$scope.fruits = fruits;
});

var shuffle = function(cArray){
  for(var k=0;k<cArray.length;k++){
    var r = Math.floor(Math.random() * cArray.length);
    var temp = cArray[k];
    cArray[k] = cArray[r];
    cArray[r] = temp;
  }
};
