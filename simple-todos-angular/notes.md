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
      //_______________________________________________________________________________
      //_______________________________________________________________________________
```
#### simple-todos-angular.js:
```javascript
        $scope.addTask = function (newTask) {
             $scope.tasks.push( {
               text: newTask,
               createdAt: new Date() }
             );
           };    
```