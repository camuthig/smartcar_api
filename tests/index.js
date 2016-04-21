var should = require('should'); 
var assert = require('assert');
var request = require('supertest');
var _ = require('lodash');
var app = require('../app');

describe('Vehicles', function() {
    describe('Details', function() {
        it('should return success getting vehicle details', function(done) {

        request(app)
        .get('/vehicles/1234')
        .end(function(err, res) {
              if (err) {
                throw err;
              }
              res.status.should.equal(200);
              res.body.driveTrain.should.equal('v8');
              done();
            });
        });

        it('should return a not found on a non-existing vehicle', function(done) {

        request(app)
        .get('/vehicles/1236')
        .end(function(err, res) {
              if (err) {
                throw err;
              }
              res.status.should.equal(404);
              res.body.should.have.property('status');
              res.body.should.have.property('message');
              done();
            });
        });
    });

    describe('Security', function() {
        it('should return door information on success', function(done) {
            request(app)
            .get('/vehicles/1234/doors')
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.equal(200);
                res.body[0].should.have.property('location');
                res.body[0].location.should.be.oneOf(['frontLeft', 'frontRight']);
                res.body[0].locked.should.be.a.Boolean;
                res.body.should.have.lengthOf(2);
                done();
            });
        });

        it('should return not found on a non-existing vehicle', function(done) {
            request(app)
            .get('/vehicles/1236/doors')
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.equal(404);
                res.body.should.have.property('status');
                res.body.should.have.property('message');
                done();
            });
        });
    });

    describe('Fuel Range', function() {
        it('should return percentage on success', function(done) {
            request(app)
            .get('/vehicles/1234/fuel')
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.equal(200);
                res.body.percent.should.be.a.Number;
                done();
            });
        });

        it('should return null on cars that do not have fuel', function(done) {
            request(app)
            .get('/vehicles/1235/fuel')
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.equal(200);
                should.equal(res.body.percent, null);
                done();
            });
        });

        it('should return not found on a non-existing vehicle', function(done) {
            request(app)
            .get('/vehicles/1236/fuel')
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.equal(404);
                res.body.should.have.property('status');
                res.body.should.have.property('message');
                done();
            });
        });
    });

    describe('Battery Range', function() {
        it('should return percentage on success', function(done) {
            request(app)
            .get('/vehicles/1235/battery')
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.equal(200);
                res.body.percent.should.be.a.Number;
                done();
            });
        });

        it('should return null on cars that do not have a battery', function(done) {
            request(app)
            .get('/vehicles/1234/battery')
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.equal(200);
                should.equal(res.body.percent, null);
                done();
            });
        });

        it('should return not found on a non-existing vehicle', function(done) {
            request(app)
            .get('/vehicles/1236/battery')
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.equal(404);
                res.body.should.have.property('status');
                res.body.should.have.property('message');
                done();
            });
        });
    });

    describe('Start/Stop Engine', function() {
        it('should return bad request for an invalid action', function(done) {
            var action = {action: 'BLAH'}
            request(app)
            .post('/vehicles/1234/engine')
            .send(action)
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.equal(400);
                res.body.status.should.equal(400);
                res.body.should.have.property('message');
                done();
            });
        });

        it('should return status on a good start request', function(done) {
            var action = {action: 'START'}
            request(app)
            .post('/vehicles/1234/engine')
            .send(action)
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.equal(200);
                res.body.status.should.be.a.String;
                res.body.status.should.be.oneOf(['success', 'error']);
                done();
            });
        });

        it('should return status on a good stop request', function(done) {
            var action = {action: 'STOP'}
            request(app)
            .post('/vehicles/1234/engine')
            .send(action)
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.equal(200);
                res.body.status.should.be.a.String;
                res.body.status.should.be.oneOf(['success', 'error']);
                done();
            });
        });

        it('should return not found on a non-existing vehicle', function(done) {
            var action = {action: 'START'}
            request(app)
            .post('/vehicles/1236/engine')
            .send(action)
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.equal(404);
                res.body.status.should.equal(404);
                res.body.should.have.property('message');
                done();
            });
        })
    });
});