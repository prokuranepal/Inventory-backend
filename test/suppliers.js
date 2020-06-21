 
process.env.NODE_ENV = 'test';
var Suppliers = require('../models/suppliers');
var server = require('../app');

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require("mongoose");


var should = chai.should();
chai.use(chaiHttp);


describe('suppliers', () => {
  Suppliers.collection.drop();

  beforeEach(function (done) {
    var newSuppliers = new Suppliers({
      Name: "karishma",
      Contact: 9866076059

    });
    newSuppliers.save(function (err) {
      done();
    });
  });
  afterEach(function (done) {
    Suppliers.collection.drop();
    done();
  });

  it('Should display all the information related to the suppliers', (done) => {
    chai.request(server)
      .get('/suppliers')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body[0].should.have.property('Name');
        res.body[0].should.have.property('Contact');
        res.body[0].Name.should.equal('karishma');
        res.body[0].Contact.should.equal(9866076059);
        done();
      });
  });

  it('should list a SINGLE suppliers<id> GET', function (done) {
    var suppliers = new Suppliers({
      Name: 'Bhaktapur suppliers',
      Contact: 9866075346

    });
    suppliers.save((err, information) => {
      chai.request(server)
        .get('/suppliers/' + information.id)
        .send(suppliers)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('_id');
          res.body.should.have.property('Name');
          res.body.should.have.property('Contact');
          res.body.Name.should.equal('Bhaktapur suppliers');
          res.body.Contact.should.equal(9866075346);
          res.body._id.should.equal(information.id);
          done();
        });
    });
  });


  it('should add a SINGLE supplier on /suppliers POST', (done) => {
    chai.request(server)
      .post('/suppliers')
      .send({ 'Name': 'Baidhya suppliers', 'Contact': 9866076074 })
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('Name');
        res.body.should.have.property('Contact');
        res.body.Name.should.equal('Baidhya suppliers');
        res.body.Contact.should.equal(9866076074);
        done();
      });

  });


  it('should update a SINGLE suppliers on /suppliers/<id> PUT', (done) => {
    chai.request(server)
      .get('/suppliers')
      .end((err, res) => {
        chai.request(server)
          .put('/suppliers/' + res.body[0]._id)
          .send({ 'Name': 'Thimi suppliers' })
          .end((error, response) => {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('object');
            response.body.should.have.property('Name');
            response.body.should.have.property('_id');
            response.body.Name.should.equal('Thimi suppliers');
            done();
          });
      });
  });

  it('should delete a SINGLE suppliers on /suppliers/<id> DELETE', (done) => {
    chai.request(server)
      .get('/suppliers')
      .end((err, res) => {
        chai.request(server)
          .delete('/suppliers/' + res.body[0]._id)
          .end(function (error, response) {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('object');
            // res.body.should.have.property('message').eql('Record sucessfully deleted');
            done();
          });
      });
  });
})