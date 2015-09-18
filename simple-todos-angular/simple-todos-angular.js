// Create new Mongo Collection
Tasks = new Mongo.Collection('tasks');

if (Meteor.isClient) {

  // This code only runs on the client
  angular.module('simple-todos', ['angular-meteor']);

  angular.module('simple-todos').controller('TodosListCtrl', ['$scope', '$meteor',
    function($scope, $meteor) {
      // using $meteor service to bind Tasks collection to $scope.tasks
      // every change will be sunced in real time accross stack.
      $scope.tasks = $meteor.collection(Tasks);
      $scope.addTask = function(newTask) {
        $scope.tasks.push({
          text: newTask,
          createdAt: new Date()
        });
      };
    }
  ]);
}
