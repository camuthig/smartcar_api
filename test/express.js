var should = require('should'); 
var assert = require('assert');
var request = require('supertest');
var app = require('../app');

describe('Express', function() {
    it('should handle pings to test the server', function(done) {
        request(app)
        .get('/ping')
        .end(function(err, res) {
            if (err) {
                throw err;
            }
            res.status.should.equal(200);
            res.body.success.should.equal(true);
            done();
        });
    });

    it('should handle not found routes', function(done) {
        request(app)
        .get('/blah')
        .end(function(err, res) {
            if (err) {
                throw err;
            }
            res.status.should.equal(404);
            res.body.status.should.equal(404);
            res.body.should.have.property('message');
            done();
        });
    });
})