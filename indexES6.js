//Course Class
class Course{
    constructor(title, instructor, image){
        this.courseId=Math.floor(Math.random()*10000);
        this.title=title;
        this.instructor=instructor;
        this.image=image;
    }
}

//UI Class
class UI{
    addCourseToList(course, index){
        const list = document.getElementById('course-list');

        var html = `
            <tr>
                <td>${index+1}</td>
                <td><img src="img/${course.image}" width="50"></td>
                <td>${course.title}</td>
                <td>${course.instructor}</td>
                <td><a href="#" data-kursId="${course.courseId}" class="btn btn-outline-danger btn-sm delete">Delete</a></td>
            </tr>
        `;

        list.innerHTML+=html;
    }

    clearControls(){
        document.getElementById('title').value="";
        document.getElementById('instructor').value="";
        document.getElementById('image').value="";
    }

    deleteCourse(element){
        if(element.classList.contains('delete')){
            element.parentElement.parentElement.remove();
            return true;
        }
    }

    showAlert(message, className){
        var alert = `
            <div class="alert alert-${className} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    
        const row = document.querySelector('.row');


        //1. parametre kısmına aldığı keywordler: beforeBegin, afterBegin, beforeEnd, afterEnd.   2.parametre gösterilecek değişken
        row.insertAdjacentHTML('beforeBegin',alert);

        
        if(row.previousElementSibling.previousElementSibling.className.includes('alert')){
            row.previousElementSibling.previousElementSibling.remove();
        }//daha önceden alert kutusu ekrana basılmış ise, üstüste iki tane alert kutusu olmasın diye öncekini siliyoruz
    }
}

//class Storage
class Storage{
    
    static getCourses(){
        let courses;

        if(localStorage.getItem('courses') === null){
            courses=[];
        }else{
            courses = JSON.parse(localStorage.getItem('courses'));
        }

        return courses;
    }//localstorageden bilgileri alıcak

    static displayCourses(){
        const courses = Storage.getCourses();

        courses.forEach((course,index) => {
            const ui = new UI();
            ui.addCourseToList(course,index);
        });
    }//getCourses fonksiyonunun aldığı bilgileri ekrana basıcak

    static addCourse(course){
        const courses = Storage.getCourses();
        courses.push(course);
        localStorage.setItem('courses',JSON.stringify(courses));
    }//kurs ekleyecek

    static deleteCourse(element){
      
        if(element.classList.contains('delete')){
            const id = element.getAttribute('data-kursId');
           
            const courses = Storage.getCourses();

            courses.forEach((course,index) => {
                if(course.courseId == id){
                    courses.splice(index,1);
                }
            });

            localStorage.setItem('courses',JSON.stringify(courses));
        }
    }//kurs silecek

}//storage işlemleri nesneye özel değil, sadece stabil methodlar barındıracağı için static methodlarla yapacağız. çünkü her nesnede aynı işlem yapılacak. aynı veritabanı kaydı, silme işlemi vb. gibi


document.addEventListener('DOMContentLoaded',Storage.displayCourses);//Sayfa yüklendiğinde kursları ekrana basıcak


document.getElementById('new-course').addEventListener('submit',function(e){
    const title = document.getElementById('title').value;
    const instructor = document.getElementById('instructor').value;
    const image = document.getElementById('image').value;


    //create course object
    const course = new Course(title, instructor, image);


    //create UI
    const ui = new UI();//ui işlemlerini ui classı üzerinden yapacağımız için burada new ledik


    //form alanlarının boş olup olmadığını kontrol ettik
    if(title === '' || instructor === '' || image === ''){
        ui.showAlert('Please complete the form','warning');
    }else{

        //aşağıda ki işlemleri fonksiyonlara parçalayıp yapmamız lazım. yoksa burada ki kodlar çok şişer ve spagetti haline gelir. kodların yönetilebilir olması açısından fonksiyonlara bölmek en iyisi. aslında bir nevi solid gibi


        //add course to list
        ui.addCourseToList(course);

        //save to localStorage
        Storage.addCourse(course);

        //clear controls
        ui.clearControls(course);

        ui.showAlert('the course has been added','success');
    }


    e.preventDefault();
});


document.getElementById('course-list').addEventListener('click',function(e){

    const ui = new UI();//silme işlemleri ui kısmında olacağı için ui classında bu işlemleri yapacağız

    //delete course
    if(ui.deleteCourse(e.target)){
        //delete from LocalStorage
        Storage.deleteCourse(e.target);

        ui.showAlert('the course has been deleted','danger');
    }
 
    
});