// Create new Mongo Collection
Tasks = new Mongo.Collection('tasks');

if (Meteor.isClient) {
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
  // This code only runs on the client
  angular.module('simple-todos', ['angular-meteor']);

  function onReady() {
    angular.bootstrap(document, ['simple-todos']);
  }

  if (Meteor.isCordova)
    angular.element(document).on('deviceready', onReady);
  else
    angular.element(document).ready(onReady);
  angular.module('simple-todos').controller('TodosListCtrl', ['$scope', '$meteor',
    function($scope, $meteor) {
      // using $meteor service to bind Tasks collection to $scope.tasks
      // every change will be sunced in real time accross stack.
      $scope.tasks = $meteor.collection(function() {
              return Tasks.find($scope.getReactively('query'), {sort: {createdAt: -1}})
      });
      $scope.addTask = function(newTask) {
       $scope.tasks.push( {
           text: newTask,
           createdAt: new Date(),             // current time
           owner: Meteor.userId(),            // _id of logged in user
           username: Meteor.user().username }  // username of logged in user
       );
     };
      $scope.$watch('hideCompleted', function() {
        if ($scope.hideCompleted)
          $scope.query = {checked: {$ne: true}};
        else
          $scope.query = {};
      });
      $scope.incompleteCount = function () {
        return Tasks.find({ checked: {$ne: true} }).count();
      };
    }
  ]);
}
