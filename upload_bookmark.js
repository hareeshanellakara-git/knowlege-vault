// UPLOAD NOTES

let uploadForm = document.querySelector(".upload-form");
let uploadList = document.createElement("ul");
uploadList.className = "upload-list";

document.querySelector("#upload").appendChild(uploadList);

let uploads = [];
let bookmarks = [];

/* -------- LOAD FROM BACKEND -------- */

fetch('https://knowledge-vault-backend-u9t7.onrender.com/data')
.then(res => res.json())
.then(data => {
    uploads = data.uploads || [];
    bookmarks = data.bookmarks || [];
    displayUploads();
    displayBookmarks();
});


/* -------- SAVE FUNCTION -------- */

function saveToBackend(){

    fetch('https://knowledge-vault-backend-u9t7.onrender.com/data')
    .then(res => res.json())
    .then(data => {

        data.uploads = uploads;
        data.bookmarks = bookmarks;

        fetch('https://knowledge-vault-backend-u9t7.onrender.com/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    });
}


/* -------- UPLOAD SUBMIT -------- */

uploadForm.addEventListener("submit", function(e){
    e.preventDefault();

    let subject = uploadForm.querySelector("input[type='text']").value;
    let fileInput = uploadForm.querySelector("input[type='file']");
    let fileName = fileInput.files[0].name;

    let uploadData = {
        subject: subject,
        file: fileName
    };

    uploads.push(uploadData);

    saveToBackend();   // 🔥 CHANGED

    displayUploads();
    uploadForm.reset();
});


/* -------- DISPLAY UPLOADS -------- */

function displayUploads(){

    uploadList.innerHTML = "";

    uploads.forEach(function(item, index){

        let li = document.createElement("li");

        li.innerHTML = `
            <i class="fa-solid fa-file"></i>
            <b>${item.subject}</b> — ${item.file}
            <button class="delete-btn" data-index="${index}">Delete</button>
        `;

        uploadList.appendChild(li);
    });
}


/* -------- DELETE UPLOAD -------- */

uploadList.addEventListener("click", function(e){

    if(e.target.classList.contains("delete-btn")){
        let index = e.target.getAttribute("data-index");
        uploads.splice(index, 1);

        saveToBackend();   // 🔥 CHANGED

        displayUploads();
    }
});


/* ===============================
   BOOKMARKS
================================ */

let bookmarkForm = document.querySelector(".bookmark-form");
let bookmarkList = document.querySelector(".bookmark-list");


/* -------- BOOKMARK SUBMIT -------- */

bookmarkForm.addEventListener("submit", function(e){
    e.preventDefault();

    let title = bookmarkForm.querySelector("input[type='text']").value;
    let link = bookmarkForm.querySelector("input[type='url']").value;

    let bookmarkData = {
        title: title,
        link: link
    };

    bookmarks.push(bookmarkData);

    saveToBackend();   // 🔥 CHANGED

    displayBookmarks();
    bookmarkForm.reset();
});


/* -------- DISPLAY BOOKMARKS -------- */

function displayBookmarks(){

    bookmarkList.innerHTML = "";

    bookmarks.forEach(function(item, index){

        let li = document.createElement("li");

        li.innerHTML = `
            <i class="fa-solid fa-link"></i>
            <a href="${item.link}" target="_blank">${item.title}</a>
            <button class="delete-btn" data-index="${index}">Delete</button>
        `;

        bookmarkList.appendChild(li);
    });
}


/* -------- DELETE BOOKMARK -------- */

bookmarkList.addEventListener("click", function(e){

    if(e.target.classList.contains("delete-btn")){
        let index = e.target.getAttribute("data-index");
        bookmarks.splice(index, 1);

        saveToBackend();   // 🔥 CHANGED

        displayBookmarks();
    }
});