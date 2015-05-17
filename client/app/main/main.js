'use strict';

angular.module('edgeplannerApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/:primaryDay',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        authenticate: true
      });
  });