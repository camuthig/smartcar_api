# Smartcar API
[![Build Status](https://travis-ci.org/camuthig/smartcar_api.svg?branch=master)](https://travis-ci.org/camuthig/smartcar_api) [![Coverage Status](https://coveralls.io/repos/github/camuthig/smartcar_api/badge.svg?branch=master)](https://coveralls.io/github/camuthig/smartcar_api?branch=master) 

This API creates a standardized JSON REST API, running on a NodeJS server, to integrate with a hypothetical OEM API. 

## Running the server

To run the server

1. Install the dependencies with `npm install`
1. Run the server with `npm start`

The server will start up on localhost:11000 by default. To change the port you can set the environment variable `PORT` to any given port.

## Running the tests

Tests are executed using Mocha with Shouldjs and Supertest.

To run the tests execute `npm test`.

Test coverage can be calculated using Istanbul with: `npm run-script coverage`

Test coverage information is generated and sent off to Coveralls on each push. This can be done locally by setting COVERALL_REPO_TOKEN environment variable and running `npm run-script coveralls`

## Manually Hitting the API
A Postman collection has been created for hitting localhost APIs for quick checks of work. Find the collection [here](https://www.getpostman.com/collections/4902a929412c7bebfa7e)
