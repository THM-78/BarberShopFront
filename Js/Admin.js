function GetBarberShopInfo(){
  $.ajax({
    url: 'https://localhost:44342/api/Admin/GetInfo',
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    success: function(data){
      document.getElementById('tbl-shopinfo').innerHTML = `<tr><td>${data.phoneNumber}</td><td>${data.address}</td><td style="direction: ltr;">${data.instaPage}</td><td><a id="shopinfo${data.id}" class="uk-button uk-text-emphasis menu-reserve-btn" onclick="Editinfo(this)" href="#modal-shopinfo" uk-toggle="" role="button">ویرایش</a></td></tr>`
      document.querySelector('.edit-info-btn').id = data.id
    },
    error: function(){
        console.log('error')
    }
  })
}
function getFileNameFromPath(filePath) {
  return filePath.split("\\").pop();
}
const PageOptions = ["dashboard", "shopinfo", "managereservation", "photoalbum"];
const expand_btn = document.querySelector(".expand-btn");

let activeIndex;

expand_btn.addEventListener("click", () => {
  document.body.classList.toggle("collapsed");
});

const current = window.location.href;

const allLinks = document.querySelectorAll(".sidebar-links a");

allLinks.forEach((elem) => {
  elem.addEventListener('click', function() {
    const hrefLinkClick = elem.href;

    allLinks.forEach((link) => {
      if (link.href == hrefLinkClick){
        link.classList.add("active");
      } else {
        link.classList.remove('active');
      }
    });
  })
});


window.addEventListener("load", function() {
  history.replaceState(null, null, "Admin.html");
  PageOptions.forEach(option =>{
    var toNone = document.getElementById(option)
    if(toNone){
      toNone.style.display = 'none'
    }
  })
  document.getElementById('dashboard').style.display = ''
});
window.onhashchange = function(){
  if(window.location.href.lastIndexOf("#") != -1){
    var urlchild = window.location.href.substring(window.location.href.lastIndexOf("#")).replace('#', '')
    const [foundItem] = PageOptions.filter(option => option === urlchild);
    if(foundItem != null){
      var section = document.getElementById(`${urlchild}`)
      PageOptions.forEach(option =>{
        var toNone = document.getElementById(option)
        if(toNone){
          toNone.style.display = 'none'
        }
      })
      section.style.display = 'block'
    }
  }
  else{
    var section = document.getElementById(`${urlchild}`)
    PageOptions.forEach(option =>{
      var toNone = document.getElementById(option)
      if(toNone){
        toNone.style.display = 'none'
      }
    })
    document.getElementById('dashboard').style.display = ''
  }
}
//ShopInfo
GetBarberShopInfo()
async function MainOption(t){
  var SectionId = t.href.substring(t.href.lastIndexOf("#")).replace('#', '')
  var section = document.getElementById(`${SectionId}`)
  if(section){
    PageOptions.forEach(option =>{
      var toNone = document.getElementById(option)
      if(toNone){
        toNone.style.display = 'none'
      }
    })
    section.style.display = 'block'
  }
  
}
function Editinfo(t){
  var id = t.id.substring(8).trim();
  $.ajax({
    url: `https://localhost:44342/api/Admin/GetInfoById/${id}`,
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    success: function(data){
      document.getElementById('editinfo-tell').value = data.phoneNumber;
      document.getElementById('editinfo-address').value = data.address;
      document.getElementById('editinfo-insta').value = data.instaPage;
    },
    error: function(){
        console.log('error')
    }
  })
}
function EditInfoBtn(){
  var Id = document.querySelector('.edit-info-btn').id;
  var PhoneNumber = document.getElementById("editinfo-tell")
  var Address = document.getElementById("editinfo-address")
  var InstaPage = document.getElementById("editinfo-insta")
  if(PhoneNumber.value == ''){
    PhoneNumber.style.borderColor = 'red'
  }
  if(Address.value == ''){
    Address.style.borderColor = 'red'
  }
  if(InstaPage.value == ''){
    InstaPage.style.borderColor = 'red'
  }
  else{
    PhoneNumber.style.borderColor = ''
    InstaPage.style.borderColor = ''
    Address.style.borderColor = ''
    var infoToEdit={
      id : Id,
      phoneNumber : PhoneNumber.value,
      address :Address.value ,
      instaPage :InstaPage.value
    }
    $.ajax({
      url: `https://localhost:44342/api/Admin/EditInfo`,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(infoToEdit),
      success: function(data){
        console.log('edited!')
        GetBarberShopInfo()
        UIkit.modal('#modal-shopinfo').hide();
      },
      error: function(){
          console.log('error')
      }
    })
  }
}
//..
//ImgAlbum
function AllWorkPhoto(){
  document.getElementById('tbl-work-photos').innerHTML = ''
  $.ajax({
    url: 'https://localhost:44342/api/Home/AllWorkPhotos',
    type: 'GET',
    dataType:'json',
  contentType: 'application/json',
  success: function(data){
    for(var i = 0; i <= data.length; i++){
      document.getElementById('tbl-work-photos').innerHTML += `<tr><td>${data[i].title}</td><td><img src="../Resources/${data[i].imageUrl}"></td><td><a id="workphoto${data[i].id}" class="uk-button uk-text-emphasis menu-reserve-btn" onclick="EditWorkPhoto(this)" href="#modal-work-photos" uk-toggle="" role="button">ویرایش</a></td></tr>`
    }
  
  },
  error: function(data)
  {
    console.log('Error')
  },
  })
}
AllWorkPhoto()
function EditWorkPhoto(t){
  document.querySelector('.image-name').innerHTML = 'عکس مورد نظر را آپلود نمایید'
  document.getElementById('photo').value = ''
  var EditImgDiv = document.getElementById('img-edit-div')
  var EditTitle = document.getElementById('edit-work-photo-title')

  var id = t.id.substring(9).trim();
  console.log(id)
  $.ajax({
    url: `https://localhost:44342/api/Admin/WorkPhotoById/${id}`,
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    success: function(data){
      EditImgDiv.innerHTML = `<img style="max-width: 50%;" src="Resources/${data.imageUrl}">`
      EditTitle.value = data.title
      document.querySelector('.edit-work-photo-btn').id = id
    },
    error: function(){
        console.log('error')
    }
  })
}
function WorkPhotoinput(input){
  var imgName = getFileNameFromPath(input.value)
  document.querySelector('.image-name').innerHTML = imgName
}


function EditWorkPhotoBtn(t){
  var inputFileImage = document.getElementById("photo");
  var formData = new FormData();
  if(inputFileImage.value != ''){
    var file = inputFileImage.files[0];
    formData.append('file', file)
  }
  var vmWork={
    id: t.id,
    title: document.getElementById('edit-work-photo-title').value,
    imageUrl: getFileNameFromPath(inputFileImage.value).trim(),
  }
  //below ajax make page refresh on success function!!
  $.ajax({
    url: 'https://localhost:44342/api/Admin/EditWorkPhoto',
    type: "POST",
    data: JSON.stringify(vmWork),
    processData: false,
    contentType: 'application/json',
    success: function (data) {
      if(inputFileImage.value != ''){
        var file = inputFileImage.files[0];
        formData.append('file', file)
        $.ajax({
          url:'https://localhost:44342/api/Admin/SaveImg',
          type: 'POST',
          data: formData,
          processData: false,
          contentType: false,
          success: function(data){
            
          },
          error: function(){
            console.log('error')
          }
        })
      }
      // AllWorkPhoto()
      // UIkit.modal('#modal-work-photos').hide()
    },
    error: function () {
    }
});
}
