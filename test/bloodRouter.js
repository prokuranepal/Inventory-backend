process.env.NODE_ENV = 'test';

let Blood = require('../models/blood');
var chai = require('chai');
var server = require('../app');
var chaiHTTP = require('chai-http');
var should = chai.should();

describe('Blood', () => {
    beforeEach((done) => { //Before each test we empty the database
        Book.remove({}, (err) => {
            done();
        });
    });
})


