//formda ki verileri direkt html olarak tabloya da basabilirdik. Fakat bunu normalde oop ile yapmamız gerekiyor. Gerçek projede verileri veritabanından çekebiliriz. Veritabanına gönderebiliriz. Daha düzgün ve sistemli bir algoritma için oop ile işlemleri yapıyoruz


//Course constructor
function Course(title, instructor, image){
    this.title=title;
    this.instructor=instructor;
    this.image=image;
}

//UI constructor
function UI(){
}//ui ile ilgili işlemleri ui constructorı üzerinden yapacağız. yarın bir gün ui ile ilgili fonksiyonlarımız çok fazlalaştığında bir karmaşıklık olmasıni kolay yönetilebilsin diye. ui ın prototype larına fonksiyonlar ekleyeceğiz.

UI.prototype.addCourseToList = function(course){
    const list = document.getElementById('course-list');
    var html = `
    <tr>
        <td>1</td>
        <td><img src="img/${course.image}" width="50"></td>
        <td>${course.title}</td>
        <td>${course.instructor}</td>
        <td><a href="#" class="btn btn-outline-danger btn-sm delete">Delete</a></td>
    </tr>
    `;

    list.innerHTML+=html;

}//dışarıdan gönderdiğimiz bir kurs objesini html kodlarına döküp tabloya ekleyecek

UI.prototype.clearControls = function(){
    document.getElementById('title').value="";
    document.getElementById('instructor').value="";
    document.getElementById('image').value="";
}//form da ki bilgileri gönderdikten sonra form inputlarını sıfırlayacak

UI.prototype.deleteCourse = function(element){
    if(element.classList.contains('delete')){
        element.parentElement.parentElement.remove();
    }
}//tablodan kurs silecek

UI.prototype.showAlert = function(message,className){
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

}//kullanıcı herhangi bir işlem yaptıktan sonra mesaj kutusu göstericek


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


        //clear controls
        ui.clearControls(course);

        ui.showAlert('the course has been added','success');
    }


    e.preventDefault();
});

document.getElementById('course-list').addEventListener('click',function(e){
    const ui = new UI();//silme işlemleri ui kısmında olacağı için ui classında bu işlemleri yapacağız

    ui.deleteCourse(e.target);
    ui.showAlert('the course has been deleted','danger');
});