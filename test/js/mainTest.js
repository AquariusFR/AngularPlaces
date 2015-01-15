/*globals console : false, requirejs: false, window: false*/
// This creates an array of all the files that Karma finds with a suffix of
// Test.js (eg utilsTest.js) to be added to the Require JS config below
/*jslint nomen: true*/
var tests = [],
    file;
for (file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        if (/Spec\.js$/.test(file)) {
            console.log("Testing : " + file);
            tests.push(file);
        }
    }
}

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base/test/js',
    paths: {
        'async': 'libs/requirejs/async',
        'requirejs': 'libs/require-2.1.15',
        'lodash': 'libs/lodash',
        'Taggle': 'libs/taggle',
        'text': 'libs/text',
        'angular': 'libs/angular/angular',
        'angular-animate': 'libs/angular/angular-animate',
        'angular-route': 'libs/angular/angular-route',
        'angular-sanitize': 'libs/angular/angular-sanitize',
        'angular-mocks': 'libs/angular/angular-mocks',
        'Squire': 'libs/Squire',
        'modules/placesApi': 'modules/mockedPlacesApi',
        'templates': '/base/test/templates',
        'directives': '/base/assets/javascripts/directives',
        'modules': '/base/assets/javascripts/modules'
    },
    shim: {
        'angular': {
            "exports": "angular"
        },
        'facturation': {
            deps: ['angular']
        },
        'angular-route': {
            deps: ['angular']
        },
        'angular-sanitize': {
            deps: ['angular']
        },
        'angular-animate': {
            deps: ['angular']
        },
        'angular-mocks': {
            deps: ['angular'],
            'exports': 'angular.mock'
        },
        'Taggle': {
            exports: 'Taggle'
        },
        'lodash': {
            exports: 'lodash'
        }
    },
    deps: tests, // add tests array to load our tests

    callback: window.__karma__.start // start tests once Require.js is done
});
