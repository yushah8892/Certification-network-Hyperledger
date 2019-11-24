const  { Router }  = require('express');
const  StudentController = require('../controllers/studentsController.js');
const  CertificateController = require('../controllers/certificateController.js');

const routes = Router();
routes.post('/create/students', function(req,res){
    console.log('index.js:',req)
    StudentController.createStudents(req,res)
});
routes.get('/students/:id', function(req,res){
    StudentController.getStudent(req,res)
});

routes.post('/create/certificate', StudentController.createStudents);
routes.get('/validate/certificate', StudentController.getStudent);
    routes.get('/',(req,res) =>{
        res.send('Welcome to Certification Network!!')
})
module.exports = routes;