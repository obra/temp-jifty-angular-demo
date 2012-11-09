'use strict';

/**
 * Directive that executes an expression when the element it is applied to loses focus.
 */
angular.module('myApp.directives', []).
  directive('ngBlur', function() {
  return function( scope, elem, attrs ) {
    elem.bind('blur', function() {
      scope.$apply(attrs.ngBlur);
    });
  };
}).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);
