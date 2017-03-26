'use strict';

/**
 * @ngdoc directive
 * @name sulWebApp.directive:userList
 * @description
 * # userList
 */
angular.module('sulWebApp')
  .directive('userList', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the userList directive');
      }
    };
  });
