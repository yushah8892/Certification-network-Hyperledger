const Student = require('../../application/models/student');
var should = require('chai').should(),
    expect = require('chai').expect,
    supertest = require('supertest'),
    api = supertest('http://localhost:8000');

describe('Create Student Test', function () {

    const student = new Student('1','yash shah','yushah8892@gmail.com');
    

    before(function (done) {

        var response;
        api.post('/create/students')
            .set('Accept', 'application/x-www-form-urlencoded')
            .send(student)
            .end(function (err, res) {
             if(err) done(err);
            expect(res.status,200);
            done();
            });

     
    });

    it('should return a 200 response', function (done) {
        api.get('/students/1')
            .set('Accept', 'application/json')
            .expect(200, done)
            .end(function(err,res){
                done();
            })
    });

    it('should be an object with keys and values', function (done) {
        api.get('/users/1')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err, res) {
                expect(res.body).to.have.property("name");
                expect(res.body.name).to.not.equal(null);
                expect(res.body).to.have.property("email");
                expect(res.body.email).to.not.equal(null);
                expect(res.body).to.have.property("studentId");
                expect(res.body.studentId).to.not.equal(null);
                done();
            });
    });
/*
    it('should have a 10 digit phone number', function (done) {
        api.get('/users/1')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err, res) {
                expect(res.body.phoneNumber.length).to.equal(10);
                done();
            });
    });

    it('should have the role of admin', function (done) {
        api.get('/users/1')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err, res) {
                expect(res.body.role).to.equal("admin");
                done();
            });
    });

    it('should be updated with a new name', function (done) {
        api.put('/users/1')
            .set('Accept', 'application/x-www-form-urlencoded')
            .send({
                name: "Kevin",
                email: "kevin@example.com",
                phoneNumber: "9998887777",
                role: "editor"
            })
            .expect(200)
            .end(function (err, res) {
                expect(res.body.name).to.equal("Kevin");
                expect(res.body.email).to.equal("kevin@example.com");
                expect(res.body.phoneNumber).to.equal("9998887777");
                expect(res.body.role).to.equal("editor");
                done();
            });
    });

    it('should access their own locations', function (done) {
        api.get('/users/1/location')
            .set('Accept', 'application/x-www-form-urlencoded')
            .send({
                userId: 1
            })
            .expect(200)
            .end(function (err, res) {
                expect(res.body.userId).to.equal(1);
                expect(res.body.addressCity).to.equal("Portland");
                done();
            });
    });


    it('should not be able to access other users locations', function (done) {
        api.get('/users/2/location')
            .set('Accept', 'application/x-www-form-urlencoded')
            .send({
                userId: 1
            })
            .expect(401)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.error.text).to.equal("Unauthorized");
                done();
            });
    });*/

});