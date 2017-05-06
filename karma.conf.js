// Karma configuration

module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', 'requirejs'],
        // list of files / patterns to load in the browser        
        files: [
            'node_modules/requirejs/require.js',
            'node_modules/karma-requirejs/lib/adapter.js', {
                pattern: 'WebContent/**',
                included: false
            }, {
                pattern: 'Test/**',
                included: false
            },
            'Test/test-main.js'
        ],
        exclude: [
            'Test/results/**'
        ],

        plugins: [
            'karma-jasmine',
            'karma-requirejs',
            'karma-coverage',
            'karma-phantomjs-launcher',
            'karma-junit-reporter'
        ],

        // files for checking coverage
        preprocessors: {
            'WebContent/common/js/**/*.js': ['coverage']
        },

        // test results reporter to use
        reporters: ['progress', 'coverage', 'junit'],

        junitReporter: {
            outputFile: 'junit-test-results.xml',
            outputDir: 'Test/results/',
            useBrowserName: false
        },

        coverageReporter: {
            check: {
                global: {
                    statements: 80,
                    branches: 70,
                    functions: 70,
                    lines: 80,
                },
                each: {
                    statements: 80,
                    branches: 70,
                    functions: 70,
                    lines: 80,
                }
            },
            reporters: [{
                type: 'lcov',
                dir: 'Test/results/',
                subdir: 'report-html'
            }, {
                type: 'cobertura',
                dir: 'Test/results/',
                subdir: '/'
            }, {
                type: 'text'
            }, {
                type: 'text-summary'
            }]
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        logLevel: config.LOG_INFO,

        autoWatch: true,

        browsers: ['PhantomJS'],

        //exit test completion
        singleRun: true
    });
};