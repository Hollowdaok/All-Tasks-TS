// Enum для статусу студента
enum StudentStatus {
    Active = "Active",
    Academic_Leave = "Academic_Leave",
    Graduated = "Graduated",
    Expelled = "Expelled"
}

// Enum для типу курсу
enum CourseType {
    Mandatory = "Mandatory",
    Optional = "Optional",
    Special = "Special"
}

// Enum для семестру
enum Semester {
    First = "First",
    Second = "Second"
}

// Enum для оцінок
enum Grade {
    Excellent = 5,
    Good = 4,
    Satisfactory = 3,
    Unsatisfactory = 2
}

// Enum для факультетів
enum Faculty {
    Computer_Science = "Computer_Science",
    Economics = "Economics",
    Law = "Law",
    Engineering = "Engineering"
}

// Інтерфейс для студента
interface Student {
    id: number;
    fullName: string;
    faculty: Faculty;
    year: number;
    status: StudentStatus;
    enrollmentDate: Date;
    groupNumber: string;
}

// Інтерфейс для курсу
interface Course {
    id: number;
    name: string;
    type: CourseType;
    credits: number;
    semester: Semester;
    faculty: Faculty;
    maxStudents: number;
}

// Інтерфейс для оцінки студента
interface GradeEntry {
    studentId: number;
    courseId: number;
    grade: Grade;
    date: Date;
    semester: Semester;
}

// Клас для управління університетською системою
class UniversityManagementSystem {
    private students: Student[] = [];
    private courses: Course[] = [];
    private grades: GradeEntry[] = [];

    // Реєстрація студента
    enrollStudent(student: Omit<Student, "id">): Student {
        const newStudent: Student = {
            ...student,
            id: this.students.length + 1,
        };
        this.students.push(newStudent);
        return newStudent;
    }

    // Реєстрація студента на курс
    registerForCourse(studentId: number, courseId: number): void {
        const student = this.students.find(s => s.id === studentId);
        const course = this.courses.find(c => c.id === courseId);

        if (!student || !course) {
            throw new Error("Student or course not found.");
        }

        if (course.faculty !== student.faculty) {
            throw new Error("Student cannot register for a course outside their faculty.");
        }

        if (this.getRegisteredStudentsForCourse(courseId).length >= course.maxStudents) {
            throw new Error("Course is already full.");
        }

        // Реєстрація студента на курс
        this.grades.push({ studentId, courseId, grade: Grade.Unsatisfactory, date: new Date(), semester: course.semester });
    }

    // Виставлення оцінки
    setGrade(studentId: number, courseId: number, grade: Grade): void {
        const registration = this.grades.find(g => g.studentId === studentId && g.courseId === courseId);
        if (!registration) {
            throw new Error("Student is not registered for this course.");
        }

        registration.grade = grade;
    }

    // Оновлення статусу студента
    updateStudentStatus(studentId: number, newStatus: StudentStatus): void {
        const student = this.students.find(s => s.id === studentId);
        if (!student) {
            throw new Error("Student not found.");
        }

        if (newStatus === StudentStatus.Graduated && student.status !== StudentStatus.Active) {
            throw new Error("Student must be active to graduate.");
        }

        student.status = newStatus;
    }

    // Отримання студентів за факультетом
    getStudentsByFaculty(faculty: Faculty): Student[] {
        return this.students.filter(s => s.faculty === faculty);
    }

    // Отримання оцінок студента
    getStudentGrades(studentId: number): GradeEntry[] {
        return this.grades.filter(g => g.studentId === studentId);
    }

    // Отримання доступних курсів за факультетом та семестром
    getAvailableCourses(faculty: Faculty, semester: Semester): Course[] {
        return this.courses.filter(c => c.faculty === faculty && c.semester === semester);
    }

    // Обчислення середнього балу студента
    calculateAverageGrade(studentId: number): number {
        const studentGrades = this.getStudentGrades(studentId);
        if (studentGrades.length === 0) {
            return 0;
        }
        const totalGrade = studentGrades.reduce((sum, gradeEntry) => sum + gradeEntry.grade, 0);
        return totalGrade / studentGrades.length;
    }

    // Отримання списку відмінників по факультету
    getTopStudents(faculty: Faculty): Student[] {
        const studentsByFaculty = this.getStudentsByFaculty(faculty);
        return studentsByFaculty.filter(student => {
            const avgGrade = this.calculateAverageGrade(student.id);
            return avgGrade === Grade.Excellent;
        });
    }

    // Допоміжні методи
    private getRegisteredStudentsForCourse(courseId: number): Student[] {
        const studentIds = this.grades.filter(g => g.courseId === courseId).map(g => g.studentId);
        return this.students.filter(s => studentIds.includes(s.id));
    }
}

// Приклад використання
const system = new UniversityManagementSystem();

// Створення студентів
const student1 = system.enrollStudent({
    fullName: "Vadim Ivanov",
    faculty: Faculty.Computer_Science,
    year: 1,
    status: StudentStatus.Active,
    enrollmentDate: new Date("2023-09-01"),
    groupNumber: "CS101"
});

const student2 = system.enrollStudent({
    fullName: "Anna Petrova",
    faculty: Faculty.Computer_Science,
    year: 1,
    status: StudentStatus.Active,
    enrollmentDate: new Date("2023-09-01"),
    groupNumber: "CS102"
});

// Створення курсів
const course1: Course = {
    id: 1,
    name: "Intro to Programming",
    type: CourseType.Mandatory,
    credits: 6,
    semester: Semester.First,
    faculty: Faculty.Computer_Science,
    maxStudents: 2
};

system['courses'].push(course1);

// Реєстрація на курс
system.registerForCourse(student1.id, course1.id);

// Виставлення оцінки
system.setGrade(student1.id, course1.id, Grade.Excellent);

// Оновлення статусу студента
system.updateStudentStatus(student1.id, StudentStatus.Graduated);

// Перевірка студентів на факультеті комп'ютерних наук
console.log(system.getStudentsByFaculty(Faculty.Computer_Science));

// Перевірка середнього балу студента
console.log(system.calculateAverageGrade(student1.id));

// Отримання відмінників
console.log(system.getTopStudents(Faculty.Computer_Science));
