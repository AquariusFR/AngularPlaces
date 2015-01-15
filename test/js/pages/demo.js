'use strict';
angular
    .module('demo', ['ngAnimate'])
    .directive('autoCompletePlaces', [autoCompletePlaces])
    .controller('DemoController', ['$scope', demoController]);
