process.env.NODE_ENV = 'test';

let HealthPost = require('../models/healthpost');
var chai = require('chai');
var server = require('../app');
var chaiHTTP = require('chai-http');
var should = chai.should();

chai.use(chaiHTTP);

//parent block
describe('Healthpost', () => {
    beforeEach((done) => {
        HealthPost.remove({}, (err) => {
            done();
        });
    });

    describe('/GET healthpost', () => {
        it('It should GET all the records in the healthpost', (done) => {
            chai.request(server)
                .get('/healthpost')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eq(0);
                    done();
                });
        })

    });

    describe('/POST healthpost', () => {
        it('it should  POST healthpost information', (done) => {
            const healthpost = {
                name: "Baidhya healthpost",
                location: 'xyz',
                gps_location: 'tyu89',
                employee: ["5ec775664aca51093c9e68d0"],
                medicine: ["5ec77dc24aca51093c9e68d2"],
                gps_location: 'tyu89'
            }
            chai.request(server)
                .post('/healthpost')
                .send(healthpost)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('location');
                    res.body.should.have.property('employee');
                    res.body.should.have.property('medicine');
                    res.body.should.have.property('gps_location');
                    done();
                });
        });

    });

    describe('/GET/:id healthpost', () => {
        it('it should GET information about healthpost by the given id', (done) => {
            const healthpost = new HealthPost({
                name: "Baidhya healthpost",
                location: 'xyz',
                gps_location: 'tyu89',
                employee: ["5ec775664aca51093c9e68d0"],
                medicine: ["5ec77dc24aca51093c9e68d2"],
                gps_location: 'tyu89'
            });
            healthpost.save((err, healthpost) => {
                chai.request(server)
                    .get('/healthpost/' + healthpost.id)
                    .send(healthpost)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('name');
                        res.body.should.have.property('location');
                        res.body.should.have.property('employee');
                        res.body.should.have.property('medicine');
                        res.body.should.have.property('gps_location');
                        res.body.should.have.property('_id').eql(healthpost.id);
                        done();
                    });
            });

        });
    });

    describe('/PUT/:id healthpost', () => {
        it('it should UPDATE information of healthpost given the id', (done) => {
            let healthpost = new HealthPost({
                name: "siddhi smriti",
                location: 'Bhaktapur',
                gps_location: 'abc',
                employee: ["5ec775664aca51093c9e68d0"],
                medicine: ["5ec77dc24aca51093c9e68d2"],
                gps_location: 'tyu89'
            })

            healthpost.save((err, healthpost) => {
                chai.request(server)
                    .put('/healthpost/' + healthpost.id)
                    .send({
                        name: "siddhi smriti",
                        location: 'Bhaktapur',
                        gps_location: 'abc',
                        employee: ["5ec775664aca51093c9e68d0"],
                        medicine: ["5ec77dc24aca51093c9e68d2"],
                        gps_location: 'xyz'
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        // res.body.should.have.property('message').eq('Healthpost information updated!');
                        res.body.should.have.property('gps_location').eq('xyz');
                        done();
                    });
            });
        });
    });

    describe('/Delete healthpost', () => {
        it('It should DELETE all the records in the healthpost according to id', (done) => {
            const healthpost = new HealthPost({
                name: "siddhi smriti",
                location: 'Bhaktapur',
                gps_location: 'abc',
                employee: ["5ec775664aca51093c9e68d0"],
                medicine: ["5ec77dc24aca51093c9e68d2"],
                gps_location: 'xyz'
            })
            healthpost.save((err, book) => {
                chai.request(server)
                    .delete('/healthpost/' + healthpost.id)
                    .end((err, res) => {
                        res.should.have.status(200);
                        done();
                    });
            })

        });
    });

});
