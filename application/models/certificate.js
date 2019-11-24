class Certificate{
    constructor({studentId,courseId,grade,hash}){
            this.studentId = studentId;
            this.courseId = courseId;
            this.grade = grade;
            this.hash = hash;
    }
}

module.exports = Certificate;