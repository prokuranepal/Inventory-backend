process.env.NODE_ENV = 'test';

let Blood = require('../models/blood');
var chai = require('chai');
var server = require('../app');
var chaiHTTP = require('chai-http');
const { verify } = require('jsonwebtoken');

var should = chai.should();

describe('Blood', () => {

    let blood1 = new Blood({
        bloodGroup: "A+ve",
        collectedDateTime: "2018-08-09",
        storedDateTime: "2019-09-10",
        expiryDateTime: "2020-09-08",
        quantity: 18,
        healthpost: "[888877779988]"
    })
    beforeEach((done) => { //Before each test we empty the database
        blood1.save(function (err) {
            done();

        })
    });

    afterEach((done) => {
        Blood.collection.drop()
        done();
    })

    it('It should GET all the records in the blood', (done) => {
        chai.request(server)
            .get('/blood')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eq(1);
                done();

            })
    });

    it('it should  POST blood information', (done) => {
        const blood = {
            bloodGroup: "AB+ve",
            collectedDateTime: "2020-09-09",
            storedDateTime: "2020-09-20",
            expiryDateTime: "2022-07-08",
            quantity: 19,
            healthpost: blood1.healthpost
        }
        chai.request(server)
            .post('/blood')
            .send(blood)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('bloodGroup');
                res.body.should.have.property('collectedDateTime');
                res.body.should.have.property('storedDateTime');
                res.body.should.have.property('expiryDateTime');
                res.body.should.have.property('quantity');
                res.body.should.have.property('healthpost');
                done();
            });
    });


    it('it should GET information about blood by the given id', (done) => {
        const blood = new Blood({
            bloodGroup: "B+ve",
            collectedDateTime: "2019-08-09",
            storedDateTime: "2018-11-20",
            expiryDateTime: "2020-07-08",
            quantity: 19,
            healthpost: blood1.healthpost

        });
        blood.save((err, blood) => {
            chai.request(server)
                .get('/blood/' + blood.id)
                .send(healthpost)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('bloodGroup');
                    res.body.should.have.property('collectedDateTime');
                    res.body.should.have.property('storedDateTime');
                    res.body.should.have.property('expiryDateTime');
                    res.body.should.have.property('quantity');
                    res.body.should.have.property('_id').eql(blood.id);
                    done();
                });
        })



    });

    it('it should UPDATE information of blood given the id', (done) => {
        let blood = new Blood({
            bloodGroup: "A-ve",
            collectedDateTime: "2019-05-09",
            storedDateTime: "2019-09-20",
            expiryDateTime: "2020-07-08",
            quantity: 17,
            healthpost: blood1.healthpost
        })

        blood.save((err, blood) => {
            chai.request(server)
                .put('/blood/' + blood.id)
                .send({
                    bloodGroup: "AB-ve",
                    collectedDateTime: "2019-05-09",
                    storedDateTime: "2019-09-20",
                    expiryDateTime: "2020-07-08",
                    quantity: 20,
                    healthpost: blood1.healthpost
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    // res.body.should.have.property('message').eq('Healthpost information updated!');
                    res.body.should.have.property('quantity').eq(20);
                    done();
                });
        });

    });

    it('It should DELETE all the records in the blood according to id', (done) => {
        const blood = new Blood({
            bloodGroup: "AB+ve",
            collectedDateTime: "2019-08-09",
            storedDateTime: "2019-07-02",
            expiryDateTime: "2020-07-08",
            quantity: 20,
            healthpost: blood1.healthpost
        })
        blood.save((err, blood) => {
            chai.request(server)
                .delete('/blood/' + blood.id)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        })
    });
});



