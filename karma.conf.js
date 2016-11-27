//jshint strict: false
module.exports = function(config) {
  config.set({

    basePath: './app',
	frameworks: ['jasmine'],
    files: [
	  'lib/jquery.min.js',
      'lib/angular.min.js',
      'lib/angular-route.min.js',
      'lib/angular-mocks.js',
	  'lib/firebase.js',
	  'lib/angularfire.min.js',
	  'js/*.js',
      'unit_tests/*.js'
    ],
	exclude: [
    'js/*.min.js',
    'js/firechat-ui.js',
    'js/firechat.js',
    'js/firebase.js',
    'js/jquery.parallax-1.1.3-min.js',
    'js/index.js',
    'unit_tests/firechat_test.js',
    'js/modernizr.custom.js'
	],
	preprocessors: {
		 'js/site.js' : ['coverage'],
		 'js/index.js' : ['coverage'],
		 'js/admin.js' : ['coverage'],
		 'js/team.js' : ['coverage'],
		 'js/member.js' : ['coverage'],
     'js/login.js' : ['coverage'],
     'js/*.js' : ['coverage']
	},
	reporters: ['progress', 'coverage'],
	coverageReporter: {
			type: 'html',
			dir: 'coverage/',
			subdir: '.'
	},
	port: 8080,
	colors: true,
    browsers: ['Chrome'],
	singleRun: true,
    plugins: [
      'karma-chrome-launcher',
      'karma-jasmine',
	    'karma-coverage'
    ]

  });
};
