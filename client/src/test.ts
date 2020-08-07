// The order of these three imports matters
import 'zone.js/dist/proxy';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/mocha-patch';

// But the order of these does not
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import 'zone.js/dist/long-stack-trace-zone';

import { getTestBed } from '@angular/core/testing';
import {
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const __karma__: any;
declare const require: any;

// Prevent Karma from running prematurely
__karma__.loaded = function() {};

// Initialize the Angular testing environment
getTestBed().initTestEnvironment(
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting()
);

// Require spec files
const context = require.context('./', true, /\.spec\.ts$/);
context.keys().map(context);

// Start Karma
__karma__.start();
