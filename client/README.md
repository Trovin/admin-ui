# admin-ui client

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.9.

## Prerequisite
	1. you should have node(>=10.16.0) installed on your machine;
	2. you should have npm installed on your machine;
	3. you should install angular cli.
	

## !IMPORTANT. Go to root application folder:
	$ cd client

## !IMPORTANT. Install application dependencies:
	$ npm i

## How to locally run the application
## !IMPORTANT. Admin UI and Admin API Server should be run in two separate Terminal Window(see below)
## Urls:
	- UI: `http://localhost:4200/`
	- API: `http://localhost:8443/api`

	# development mode
		Run Admin UI(in first terminal window):
			$ npm run proxy
		Run Admin API Server(in second terminal window):
			$ npm run galaxy-ui-dev

## How to build/run the application with Integration setup 
## Urls:
	- UI: `{{integration_domain_name}}:8443/portal`
	- API: `{{integration_domain_name}}:8443/api`

	$ npm run integration
	$ npm run galaxy-ui-integration
	
## How to build/run the application with Production setup
## Urls:
	- UI: `{{production_domain_name}}:8443/portal`
	- API: `{{production_domain_name}}:8443/api`

	$ npm run production
	$ npm run galaxy-ui-production


## Analyze bundle content
	- added `--stats-json` to appropriate package.json "scripts", like
		"integration": "rm -rf ./integration && ng build --stats-json --prod --aot ..."

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
