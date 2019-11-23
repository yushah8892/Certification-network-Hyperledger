import { Router } from 'express';
import StudentController from '../controllers/studentsController.js';
const routes = Router();
routes.get('/create/students', StudentController.createStudents);
routes.get('/:id', StudentController.getStudent);
export default routes;