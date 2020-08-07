// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function(config) {
	var _config = {
		basePath: '',
		frameworks: ['mocha', 'chai', 'sinon', '@angular-devkit/build-angular'],
		plugins: [
			require('@angular-devkit/build-angular/plugins/karma'),
			require('karma-chrome-launcher'),
			require('karma-mocha-reporter'),
			require('karma-mocha'),
			require('karma-chai'),
			require('karma-sinon')
		],
		client: {
			captureConsole: false
		},
		reporters: ['progress', 'mocha'],
		mochaReporter: {
			showDiff: true
		},
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: false,
		singleRun: true,
		customLaunchers: {
			ChromeHeadless: {
				base: 'Chrome',
				flags: [
					'--no-sandbox',
					'--disable-setuid-sandbox',
					'--headless',
					'--disable-gpu',
					'--remote-debugging-port=9222'
				]
			}
		},
		browsers: ['ChromeHeadless']
	};

	config.set(_config);
};