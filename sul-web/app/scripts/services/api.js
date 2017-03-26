'use strict';

/**
 * @ngdoc service
 * @name sulWebApp.api
 * @description
 * # api
 * Service in the sulWebApp.
 */
angular.module('sulWebApp')
  .service('api', function ($http) {
    var url_api = 'http://10.0.1.141:3001';
    return {
      post: {
        write: function() {
          return $http({method:' POST', url: url_api+'/post'});
        },
        list: {
          latest: function() {
            return $http({method: 'GET', url: url_api+'/post/list/latest'});
          },
          user: function(id) {
           return $http({method: 'GET', url: url_api+'/post/user/'+id});
          },
        },
        get: function(id) {
          return $http({method: 'GET', url: url_api+'/post/'+id});
        },
        update: function(id) {
          return $http({method: 'PUT', url: url_api+'/post/'+id)});
        },
        delete: function(id) {
          return $http({method: 'DELETE', url: url_api+'/post/'+id)});
        },
      },
      message: {
        send: function(id_user, message) {
          return $http({method: 'POST', url: url_api+'/message/send'});
        },
        list: function() {
          return $http({method: 'GET', url: url_api+'/message/list'});
        },
      },
    },
  });
