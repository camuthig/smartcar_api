/*
Routes to create an interface between our standardized API and GM
specific APIs. 
*/

var express = require('express');
var _ = require('lodash');
var router = express.Router();
var request = require('request-json');
var client = request.createClient('http://gmapi.azurewebsites.net/');

/**
 * Checks for errors in the result arguments of a client request
 *
 * @param {Object} err An error when applicable (usually from http.ClientRequest object)
 * @param {http.IncomingMessage} response The full message from the client response
 * @param {Object} body The JSON body from the response
 * @return {Object} the error results on the response. Will be falsey in the case of a successful response
 */
var _handleResponse = function(err, response, body) {
    if (err || response.statusCode !== 200) {
        console.error(err);
        return {
            status: 500,
            message: 'Unknown error occurred'
        };
    } else if (body.status != 200){
        // Impossible to know the range of error codes from the API with given documentation,
        // but we will assume most are usable, except for items without our own code's
        // control, such as having a typo in the URL we are hitting.
        if (body.status == 404 && body.reason == 'Service not found.') {
            console.error('Invalid service provided to API.')
            return {
                status: 500,
                message: 'Internal error occurred'
            };
        } else {
            console.error('Non-200 code back from vehicle');
            return {
                status: parseInt(body.status),
                message: body.reason
            };
        }
        
    }
}

/* GET vehicle details. 
    /:id

    {
      "vin": "1213231",
      "color": "Metallic Silver",
      "doorCount": 4,
      "driveTrain": "v8"
    }
*/
router.get('/:id', function(req, res, next) {
    var data = {
        id: req.params.id,
        responseType: 'JSON'
    };

    client.post('getVehicleInfoService', data, function(err, response, body) {
        var error = _handleResponse(err, response, body);
        if (error) {
            res.status(error.status).json(error);
        } else {
            res.json({
                vin: body.data.vin.value,
                color: body.data.color.value,
                doorCount: (body.data.fourDoorSedan.value == "True") ? 4 : 2,
                driveTrain: body.data.driveTrain.value
            });
        }
    });
});

/* GET vehicle door information 
    /vehicles/:id/doors

    [
      {
        "location": "frontLeft",
        "locked": true
      },
      {
        "location": "frontRight",
        "locked": true
      }
    ]
*/
router.get('/:id/doors', function(req, res, next) {
    var data = {
        id: req.params.id,
        responseType: 'JSON'
    };

    client.post('getSecurityStatusService', data, function(err, response, body) {
        var error = _handleResponse(err, response, body);
        if (error) {
            res.status(error.status).json(error);
        } else {
            var locations = [];
            _.forEach(body.data.doors.values, function(loc) {
                locations.push({
                    location: loc.location.value,
                    locked: (loc.locked.value == 'True') ? true : false
                });
            });
            res.json(locations);
        }
    });

});

/* GET fuel range
    /vehicles/:id/fuel

    {
      "percent": 30
    }
*/
router.get('/:id/fuel', function(req, res, next) {
    var data = {
        id: req.params.id,
        responseType: 'JSON'
    };

    client.post('getEnergyService', data, function(err, response, body) {
        var error = _handleResponse(err, response, body);
        if (error) {
            res.status(error.status).json(error);
        } else {
            res.json({
                percent: (body.data.tankLevel.type == 'Number') ? parseInt(body.data.tankLevel.value) : null
            });
        }
    });

});

/* GET battery range
    /vehicles/:id/battery

    {
      "percent": 30
    }
*/
router.get('/:id/battery', function(req, res, next) {
    var data = {
        id: req.params.id,
        responseType: 'JSON'
    };

    client.post('getEnergyService', data, function(err, response, body) {
        var error = _handleResponse(err, response, body);
        if (error) {
            res.status(error.status).json(error);
        } else {
            res.json({
                percent: (body.data.batteryLevel.type == 'Number') ? parseInt(body.data.batteryLevel.value) : null
            });
        }
    });

});

/* POST start/stop engine
    /vehicles/:id/engine

    REQUEST: 
        {
          "action": "START|STOP"
        }

    RESPONSE: 
        {
          "status": "success|error"
        }
*/
router.post('/:id/engine', function(req, res, next) {
    var action = 'STOP_VEHICLE';
    if (req.body.action == 'START') {
        action = 'START_VEHICLE';
    } else if (req.body.action !== 'STOP') {
        res.status(400).json({
            status: 400,
            message: `Engine can only START or STOP. ${req.body.action} is invalid`
        });
        return
    }

    var data = {
        id: req.params.id,
        command: action,
        responseType: 'JSON'
    };

    client.post('actionEngineService', data, function(err, response, body) {
        var error = _handleResponse(err, response, body);
        if (error) {
            res.status(error.status).json(error);
        } else {
            res.json({
                status: (body.actionResult.status == 'EXECUTED') ? 'success' : 'error'
            });
        }
    });

});

module.exports = router;
