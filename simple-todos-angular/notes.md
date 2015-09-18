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
