process.env.NODE_ENV = 'test';

let HealthPost = require('../models/blood');
var chai = require('chai');
var server = require('../app');
var chaiHTTP = require('chai-http');
var should = chai.should();
