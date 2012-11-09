'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
//angular.module('myApp.services', []).

angular.module('myApp.services', ['ngResource']).
  value('version', '0.1').
  factory('Task', function($resource) {
    return $resource('/api/1/tasks/:task_id', {}, {
      index: {method: 'GET', isArray: true},
      new: { method: 'GET'},
      create: {method: 'POST'},
      show: { method: 'GET'},
      edit: { method: 'GET'},
      update: { method: 'PUT'},
      destroy: { method: 'DELETE' }
    });
  });
