// ! Ay Dizisi
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];


// ! Html'den Javascript'e çekilen elemanlar
const addBox = document.querySelector(".add-box");   // console.log(addBox);
const popupBoxContainer = document.querySelector(".popup-box");
const popupBox = document.querySelector(".popup");
const closeBtn = document.querySelector("#close-btn");
const form = document.querySelector("form");
const wrapper = document.querySelector(".wrapper");
let popupTitle = document.querySelector("header p");
let submitBtn = document.querySelector("#submit-btn");

// ! localstorage'dan note verilerini al.Eğer localstorage'da note yoksa bunun başlangıç değerini boş dizi olarak belirle.

let notes = JSON.parse(localStorage.getItem("notes")) || [];


// ! Güncelleme işlemi için gereken değişkenler
let isUpdate = false;
let updateId = null;

// Sayfanın yüklenme anını izle
document.addEventListener("DOMContentLoaded", () => {
  // Sayfa yüklendiğinde notları render eden fonksiyonu çalıştır
  renderNotes(notes);
});




// * addBox elemanına tıklanınca popup'ı aç
addBox.addEventListener("click", () => {
  //  popupBoxContainer &&  popupBox ı görünür kılmak için show classı ekle
  popupBoxContainer.classList.add("show");
  popupBox.classList.add("show");

  // *Body'nin kaydırılmasını engelle  add new notesu açtığımızda arka plan sabit kalıyor.
  document.querySelector("body").style.overflow = "hidden";

});




// * closebtn elemanına tıklanınca popup'ı kapat (çarpıya bastığımızda)
closeBtn.addEventListener("click", () => {
  //  popupBoxContainer &&  popupBox ekrandan gizlemek için  show classını kaldır
  popupBoxContainer.classList.remove("show");
  popupBox.classList.remove("show");


  //* Body'nin kaydırılmasını auto'ya çevir.yani çarpı ile kapattığımızda arka planı eski haline çeviriyor
  document.querySelector("body").style.overflow = "auto";

  // Eğer update işlemi yapılmaz ve popup kapatılırsa popup'ı eski haline çevir
  isUpdate = false;
  updateId = null;
  popupTitle.textContent = "New Note";
  submitBtn.textContent = "Add Note";

  // Formu resetle
  form.reset();

});


// ************ formun gönderilmesini izle*******************
form.addEventListener("submit", (e) => {
  //  form'un sayfa yenilmesini engelle
  e.preventDefault();

  // Form içerisindeki input ve textarea'ya eriş
  const titleInput = e.target[0];   //title
  const descriptionInput = e.target[1];  //description


  //  input ve textarea nın değerlerine eriş ve başında-sonunda boşluk varsa bunu kaldır
  //! .trim değerler girildikten sonra metinin başında boşluk varsa başlığı kaldırıyor
  let title = titleInput.value.trim();
  let description = descriptionInput.value.trim();


  // Eğer inputlar boş bırakılmışsa uyarı ver

  if (!title && !description) {
    alert("Lütfen formdaki gerekli kısımları doldurunuz !");

    return; //!Burada return kullanımı ile if bloğu çalıştıktan sonras kodun devam etmesini engelledik
  }
  // console.log(new Date().getDate());
  // console.log(new Date().getMonth() + 1);
  // console.log(new Date().getFullYear());


  // console.log(months[2]);
  // console.log(new Date().getMonth());
  // Tarih verisini oluştur
  const date = new Date();

  // Gün ay ve yıl değerleri oluştur
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const id = date.getTime();


  //***********Aşağıda şöyle bir şey yapılıyor eğer güncelleme işlemi yapılıyorsa notları güncelle değilse yeni not ekle.************
  if (isUpdate) {
    // Güncelleme yapılmak istenen notu notes dizisi içerisinden bul
    const findIndex = notes.findIndex((note) => note.id == updateId);

    // Index'i bilinen elemanı dizi elemanını güncelle

    notes[findIndex] = {
      title,
      description,
      id,
      date: `${month} ${day},${year}`,
    };

    // Güncelleme modunu kapat ve popup içerisindeki elemanları eskiye çevir
    isUpdate = false;
    updateId = null;
    popupTitle.textContent = "New Note";
    submitBtn.textContent = "Add Note";

  } else {
    // Not verisini yönetmek için bir obje oluştur.

    let noteInfo = {
      id,
      title,
      description,
      date: `${month} ${day},${year}`,

    };


    // noteInfo'yu note dizisine ekle note
    notes.push(noteInfo);
  };






  // *LocalStorage'a not dizisini ekle
  localStorage.setItem("notes", JSON.stringify(notes));


  // *Input ve text areanın içiini temizle.
  titleInput.value = "";
  descriptionInput.value = "";

  // *Popup'ı kapat.
  popupBoxContainer.classList.remove("show");
  popupBox.classList.remove("show");

  //*Body'nin kaydırılmasını autoya çevir
  document.querySelector("body").style.overflow = "hidden";


  // Notları render et
  renderNotes(notes);
});

//* Localstorage (Lokal Depo)

//* Localstorage bizim için tarayıcıda veri tutan bir depodur.Bu alanda küçük çaplı verilerimizi tutarız.Bu alan bizim için key-value değer çiftleri halinde değerler tutar.Ve verileri yalnızca string veri formatında kabul eder.

// *Localstorage'a eleman ekleme

//* Localstorage'a eleman eklemek için  localStorage.setItem metodu kullanılır.Bu metod bizden bir key değeri ve bu keyin değer karşılığı olacak datayı vermemizi ister.Hem key hemde data string veri formatında olmalıdır.

// const users = ["Altan", "Didem", "Ali", "Işıl"];

// localStorage.setItem("users", JSON.stringify(users));

// *Localstorage'dan eleman alma
//* Localstorage'a eleman eklemek için  localStorage.getItem metodu kullanılır. *console.log(JSON.parse(localStorage.getItem("users")));

// ! Localstorage'a eleman ekler ve localStorage'dan eleman alırken veri dönüşümü yapmayı unutmamalıyız [JSON.stringify && JSON.parse]

// **************Notları arayüze render edecek fonksiyon.***********************************

function renderNotes(notes) {

  //!mevcut notları silmek için
  //Aşağıdaki kod JavaScript kullanarak HTML sayfasındaki tüm .note sınıfına sahip öğeleri seçer ve kaldırır. İşleyişi şöyle:
  // document.querySelectorAll(".note"):
  // Tüm .note sınıfına sahip öğeleri NodeList olarak seçer.
  // .forEach((note) => note.remove()):
  // Her bir öğe üzerinde döngüye girer ve remove() metoduyla DOM'dan kaldırır.

  document.querySelectorAll(".note").forEach((note) => note.remove());

  // *aşağıdaki satır, JavaScript’in forEach metodu ile notes adlı bir dizideki her bir eleman (note) üzerinde döngü yapar.
  notes.forEach((note) => {

    // Note dizisindeki herbir eleman için birer note kartı oluştur
    // Note elemanını ayırt edebilmemiz için bu elemana bir id ata.Bir elemana id atamak için bunu data özelliği olarak atarız.
    // *data-id="${note.id}" ==> Bu kod satırı, HTML elemanına bir data özelliği ekler ve bu özelliğe note.id değerini atar.notu silmek için yazdık.
    let noteEleman = `<li class="note" data-id="${note.id}"> >
  
    <!-- Note Details -->
    <div class="details">
      <!-- Title && Description -->
      <p class="title">${note.title}</p>
      <p class="description">${note.description}</p>
    </div>
    <!-- Bottom -->
    <div class="bottom">
      <span>${note.date}</span>
      <div class="settings">  
        <!-- Icon -->
        <i class="bx bx-dots-horizontal-rounded"></i>
        <!-- Menu -->
        <ul class="menu">
          <li class='editIcon'><i class="bx bx-edit"></i> Düzenle</li>
          <li class='deleteIcon'><i class="bx bx-trash-alt"></i> Sil</li>
        </ul>
      </div>
    </div>
  </li>`;

    addBox.insertAdjacentHTML("afterend", noteEleman);
    // *Bu kod satırı, JavaScript'in insertAdjacentHTML metodu kullanılarak addBox adlı bir HTML elemanının sonrasına (afterend) yeni bir HTML içeriği (note) eklemeyi amaçlıyor.
  });


}
//editIcon ve  deleteIcon classlarını vermemizin nedeni düzenle yada sile tamamen basabilmek yani ikonla birlikte yanında sil yada düzenle simgesi de olması

// Menu kısmının görünürlüğünü ayarlayan fonksiyon
//!eleman wrapper.addEventListener("click",) deki e.target için yazıyoruz.
function showMenu(eleman) {
  // ! parentElement ==> Bir elemanın kapsayıcısına erişmek için kullanılır

  // Dışarıdan gelen elemanın kapsayıcına show classı ekle
  eleman.parentElement.classList.add("show");

  // Eklenen show classını üç nokta haricinde bir yere tıklanırsa kaldır
  document.addEventListener("click", (e) => {
    // Tıklanılan eleman üç nokta (i etiketi) değilse yada kapsam dışarısına tıklandıysa
    if (e.target.tagName != "I" || e.target != eleman) {
      // Kapsam dışarısına tıklandıysa show classını kaldır
      eleman.parentElement.classList.remove("show");
    }
  });
}

// * Wrapper kısmındaki tıklanmaları izle

wrapper.addEventListener("click", (e) => {

  // console.log(e.target); tıklanmaları izleyebilirim
  // console.log(e.target.classList.contains("bx-dots-horizontal-rounded"));
  // Eğer üç noktaya tıklandıysa .Aşağıdaki kod satırı, tıklanan elemanın bir i elementi olup olmadığını kontrol eder.yan bx-dots-horizontal-rounded clasını içeriyorsa
  if (e.target.classList.contains("bx-dots-horizontal-rounded")) {
    // console.log(e.target);
    //3 noktanın kapsam elamına eriş
    // console.log(e.target.parentElement);


    // Aşağıdaki kod, bir olay dinleyicisi (event listener) içinde çalıştırıldığında, olayın hedefinin (e.target) ebeveyn öğesini (parentElement) alıp, ona "show" adında bir CSS sınıfı ekler.
    // e.target: Olayın gerçekleştiği HTML öğesini temsil eder.parentElement: e.target öğesinin ebeveyn (parent) öğesini seçer.
    // .classList.add("show"): Bu ebeveyn öğeye "show" sınıfını ekler.
    const parentElement = e.target.parentElement;
    parentElement.classList.add("show");

    // Show Menu fonksiyonunu çalıştır
    showMenu(e.target);
  }

  // Eğer sil butonuna  tıklandıysa
  else if (e.target.classList.contains("deleteIcon")) {
    // Kullanıcıdan silme işlemi için onay al
    const res = confirm("Bu notu silmek istediğinize eminmisiniz ?");
    //res true demek kullanıcı evet dedi demek
    // Eğer kullanıcı silme işlemini kabul ettiyse
    if (res) {
      // parentElement ile bir elemanın kapsam elemanına eriştik.Ama kapsam eleman sayısını arttıkça bunu yapmamız bir hayli zorlaşır.
      // Bunun yerine closest metodunu kullanırız.Bu metot belirtilen class yada id'ye göre en yakın elemana erişmek için kullanılır.

      // Tıklanılan elemanın kapsayıcısı olan note kartına eriş .En yakın .note git demek
      const note = e.target.closest(".note");

      // Erişilen note kartının id'sine eriş.String old. için numbera çevir 
      const notedId = parseInt(note.dataset.id);

      // Id'si bilinen note'u note dizisinden kaldır:filter filtreleme işlemi yapar
      notes = notes.filter((note) => note.id != notedId);

      // LocalStorage'ı güncelle
      localStorage.setItem("notes", JSON.stringify(notes));

      // Notların render et(arayüze at)
      renderNotes(notes);
    }


  }
  // Eğer düzenle butonuna  tıklandıysa
  else if (e.target.classList.contains("editIcon")) {
    // Tıklanılan editIcon butonun kapsayıcısı olan note elemanına eriş
    const note = e.target.closest(".note");
    // Erişilen notun id'sine eriş
    const noteId = parseInt(note.dataset.id);
    // Erişilen notu notes dizisi içerisinde bul
    const foundedNote = notes.find((note) => note.id == noteId);

    // Popup'ı güncelleme moduna sok
    isUpdate = true;
    updateId = noteId;     //    const noteId = parseInt(note.dataset.id);

    // Popup'ı görünür kıl
    popupBoxContainer.classList.add("show");
    popupBox.classList.add("show");

    // Popup içerisindeki input ve textarea'ya notun title ve description değerlerini ata
    form[0].value = foundedNote.title;
    form[1].value = foundedNote.description;

    // Popup içerisindeki title ve add buttonın içeriğini update moduna göre düzenle
    popupTitle.textContent = "Update Note";
    submitBtn.textContent = "Update";
  }
});