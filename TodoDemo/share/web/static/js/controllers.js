'use strict';

/* Controllers */


function MyCtrl1() {}
MyCtrl1.$inject = [];


function MyCtrl2() {
}
MyCtrl2.$inject = [];


// Controller
function TasksController($scope, Task) {
  $scope.tasks = [];
  $scope.index = function() {
    console.log('Index');
    Task.query(function(resource) {
      $scope.tasks = resource;
    }, function(response) {
      console.log(response);
    });
  };
  $scope.new = function() {
    console.log('New');
    Task.get({action: 'new'}, function(resource) {
      console.log(resource);
    }, function(response) {
      console.log(response);
    });
  };
  $scope.show = function(t_id) {
    console.log('Show');
    Task.get({task_id: t_id}, function(resource) {
      console.log(resource);
    }, function(response) {
      onsole.log(response);
    });
  };
  $scope.edit = function(t_id) {
    console.log('Edit');
    Task.get({task_id: t_id, action: 'edit'}, function(resource) {
      console.log(resource);
    }, function(response) {
      console.log(response);
    });
  };
  // data in JSON, eg, {title: 'new task'}
  $scope.create = function(data) {
    console.log('Create');
    $scope.newTaskDescription = '';
    Task.save({}, data, function(resource) {
      console.log(resource);
            $scope.tasks.push(resource);
    }, function(response) {
            console.log(response);
    });
  };
  // data in JSON, eg, {title: 'edited task'}
  $scope.update = function(t_id, data) {
    console.log('Update');
    Task.update({task_id: t_id}, data, function(resource) {
      console.log(resource);
    }, function(response) {
      console.log(response);
    });
  };
  $scope.destroy = function(index) {
    console.log('Destroy');
        var task = $scope.tasks[index];
    Task.delete({task_id: task.id}, function(resource) {
      // ajax success
        console.log("Id is "+task.id+". Index is "+index);
        if (index != -1) {
            $scope.tasks.splice(index,1);
        } 

    
    }, function (response) {
      // ajax failed
      console.log(response);
    });
  };
  $scope.action = function(t_id, a) {
    console.log('Other action');
    Task.get({task_id: t_id, action: a}, function(resource) {
    }, function(response) {
      console.log(response);
    });
  };
  $scope.upcase = function(t_id) {
    Task.get({task_id: t_id}, function(resource) {
      var task = resource;
      console.log(task);
      task.title = angular.uppercase(task.title);
      console.log(task);
      task.$update();
    }, function(response) {
      console.log(response);
    });
  }

  $scope.taskFromId = function(t_id) {
        return $scope.tasks[t_id-1];

    };
    $scope.toggleDone = function(t_id) {
        var task = $scope.taskFromId(t_id);
        $scope.update(task.id, { done : task.done });
    };

  $scope.index(); 
};
