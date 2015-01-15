/*global module: false*/
module.exports = function (config) {
    "use strict";
    config.set({

        basePath: '',

        frameworks: [
            'requirejs',
            'mocha',
            'chai'],

        preprocessors : {
            'app/assets/javascripts/**/*.js' : ['coverage']
        },

        files: [
            {pattern: 'assets/javascripts/**/*.js', included: false},
            {pattern: 'test/js/libs/**/*.js', included: false},
            {pattern: 'test/js/libs/*.js', included: false},
            {pattern: 'test/js/controllers/*.js', included: false},
            {pattern: 'test/js/pages/*.js', included: false},
            {pattern: 'test/js/modules/*.js', included: false},
            {pattern: 'test/templates/*.html', included: false},
            'test/js/mainTest.js'
        ],

        exclude: [],


        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['mocha', 'progress', 'coverage'],

        junitReporter: {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        },
        coverageReporter: {
            type: 'html',
            dir: 'target/jscoverage/'
        },

        // report which specs are slower than 600ms
        // CLI --report-slower-than 600
        reportSlowerThan: 600,
        // enable / disable colors in the output (reporters and logs)
        colors: true,

        autoWatch: true,
        browsers: ['PhantomJS']
    });
};

