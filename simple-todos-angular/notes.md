##Angular Templates in Meteor
- angular-meteor package parses all .ng.html files and puts them in Angular's template cache with the id of their full path
- when a .ng.html file is placed in /client, it is available to ng-include or ui-router as client/template.ng.html
- all code in ng.html is compiled with Angular. Angular binds the data into the templates
###HTML Files in Meteor define Templates
- meteor parses all .HTML files and identifies three top-level tags: <head>,<body>, and <template>.
- <template> is compiled into Meteor templates which can be referenced by HTML: {{> templateName}}, JS: Template.templateName.
## Storing Tasks in a Collection
- collections are meteors way of storing persistent data
- collections can be accessed both server and client side
- easy to write view logic without having to write a lot of server code
- collections update themselves automatically, view will automatically display the most up-to-date data
```javascript
          MyCollection = new Mongo.Collection("my-collection");
          //SERVER: sets up MongoDB collection on
          //CLIENT: creates a cache connection to the server collection
```
```javascript
          // Create new Mongo Collection
          Tasks = new Mongo.Collection('tasks');

          if (Meteor.isClient) {

            // This code only runs on the client
            angular.module('simple-todos',['angular-meteor']);

            angular.module('simple-todos').controller('TodosListCtrl', ['$scope', '$meteor',
                function ($scope, $meteor) {
                  // using #meteor service to bind Tasks collection to $scope.tasks
                  // every change will be sunced in real time accross stack.
                  $scope.tasks = $meteor.collection(Tasks);

                }]);
            }

```
###Inserting tasks from the console
      opens a console into your app's local development database:
        - meteor mongo
        - db.tasks.insert({ text: "Hello world!", createdAt: new Date() });
      - The browser will immediately update to show the new task.
      - didn't have to write any code to connect the server-side database to our front-end code — it just happened automatically.
##Adding Tasks With A form
####  todos-list.ng.html:
```javascript
        <form class="new-task" ng-submit="addTask(newTask); newTask='';">
        <input ng-model="newTask" type="text"
             name="text" placeholder="Type to add new tasks" />
        </form>

```
Attaching events to templates:
  -  listening to the submit event on our form to call the addTask scope function and to reset the input field.
#### simple-todos-angular.js:
```javascript
        $scope.addTask = function (newTask) {
             $scope.tasks.push( {
               text: newTask,
               createdAt: new Date() }
             );
           };    
```
Inserting into a collection:
  - adding a task to the tasks collection by calling
  ```javascript
        $scope.tasks.push()
```
  - Being able to insert anything into the database from the client isn't very secure

###Sorting our tasks
- Angular sort filter can be used, use a different method because it is better for real world use cases.

####  simple-todos-angular.js:
```javascript
  // Replace the Tasks collection variable with a function inside our $meteor.collection service call.
  //function will return a the result of calling the find function with the sort parameter on our Tasks
        $scope.tasks = $meteor.collection( function() {
          return Tasks.find({}, { sort: { createdAt: -1 } })
      });
```
##Checking off and Deleting Tasks
```javascript
        <ul ng-repeat="task in tasks">
            <li ng-class="{'checked': task.checked}">
              <button class="delete" ng-click="tasks.remove(task)">&times;</button>

              <input type="checkbox" ng-model="task.checked" class="toggle-checked" />

              <span class="text">{{task.text}}</span>
            </li>
          </ul>
```
  Update:
    - bind the checked state of each task to a checkbox with Angular
    - Meteor saves and syncs the stat across all clients. No code needed

  Delete:
    - tasks.remove(task): $meteor.collection helper remove takes an object or the id of an object and removes it from the database

  Classes:
    - bind the checked state of a task to a class with ng-class
    - <li ng-class="{'checked': task.checked}">
      - if the checked property of a task is true, the checked class is added to our list item.

#Running your app on Android or iOS
- Angular needs the main document to be ready so it can bootstrap
- different devices have different events for ready.
- change the way we bootstrap our Angular app
  - remove ng-app from the <body> (simple-todos-angular.html)
  - simple-todos-angular.js Bootstrap Angular to mobile as well
  ```javascript
  function onReady() {
    angular.bootstrap(document, ['simple-todos']);
  }

  if (Meteor.isCordova)
    angular.element(document).on('deviceready', onReady);
  else
    angular.element(document).ready(onReady);
  ```
#Filtering collections
- client-side data filtering feature users can check a box to see only incomplete tasks
- Add hideComplete checkbox to template:
```
  <label class="hide-completed">
      <input type="checkbox" ng-model="$parent.hideCompleted"/>
      Hide Completed Tasks
    </label>

  ```
- checkbox binds to the scope's hideCompleted variable.
- $parent creates a new child scope
- update our $scope.tasks query each time hideCompleted changes.
###
Filtering collection syntax
- query to return only the not completed todos looks like that:

        Tasks.find({ checked: {$ne: true} }, { sort: { createdAt: -1 } })
###Connecting Angular bindings to Meteor's reactivity
- $scope.getReactively function that turns Angular scope variables into Meteor reactive variables.
- Make query parameter reactive:
  ```javascript
        function ($scope, $meteor) {

        $scope.tasks = $meteor.collection(function() {
        return Tasks.find($scope.getReactively('query'), {sort: {createdAt: -1}})
        });
```
####  Showing a count of incomplete tasks
  ```javascript
         $scope.incompleteCount = function () {
                return Tasks.find({ checked: {$ne: true} }).count();
              };
  ```
#Adding user accounts
- accounts system and a drop-in login user interface that lets you add multi-user functionality to your app in minutes.
-       meteor add accounts-ui accounts-password
- Add Blaze loginButtons template to HTML:
        <meteor-include src="loginButtons"></meteor-include>
-  meteor-include directive let's you add any Blaze template into your Angular templates.
- loginButtons which is the Blaze template for user authentication flow supplied with the accounts-ui package.
- add the following code to configure the accounts UI to use usernames instead of email addresses:
```javascript
        Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
        });
```
- Only display the new task input field to logged in users
  - Add owner and username to created task:
```javascript
        $scope.addTask = function(newTask) {
        $scope.tasks.push( {
            text: newTask,
            createdAt: new Date(),             // current time
            owner: Meteor.userId(),            // _id of logged in user
            username: Meteor.user().username }  // username of logged in user
        );
        };

```
  - add an ng-show directive to only show the form when there is a logged in user:
        <form class="new-task"
          ng-submit="addTask(newTask); newTask='';"
          ng-show="$root.currentUser">
  - add a statement to display the username field on each task:
          <span class="text">
          <strong>{{task.username}}</strong> - {{task.text}}
        </span>
