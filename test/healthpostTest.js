process.env.NODE_ENV = 'test';

let HealthPost = require('../models/healthpost');
var chai = require('chai');
var server = require('../app');
var chaiHTTP = require('chai-http');
const healthpost = require('../models/healthpost');
var should = chai.should();

chai.use(chaiHTTP);


//parent block
describe('Healthpost', () => {

    let healthPost1 = new HealthPost({
        name: "kathmandu pharma",
        location: "xyz",
        employee: ["5ec775664aca51093c9e68d0"],
        medicine: ["5ec77dc24aca51093c9e68d2"],
        gps_location: 'abc'
    });

    beforeEach(function (done) {

        healthPost1.save(function(err){
            done();
        });
    })

    afterEach(function (done) {
        HealthPost.collection.drop();
        done();
    });




})






