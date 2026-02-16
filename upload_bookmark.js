
// UPLOAD NOTES


let uploadForm = document.querySelector(".upload-form");
let uploadList = document.createElement("ul");
uploadList.className = "upload-list";

document.querySelector("#upload").appendChild(uploadList);


// Load saved uploads
let uploads = JSON.parse(localStorage.getItem("uploads")) || [];
displayUploads();


// Upload submit
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
    localStorage.setItem("uploads", JSON.stringify(uploads));

    displayUploads();
    uploadForm.reset();
});


// Display uploads
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


// Delete upload
uploadList.addEventListener("click", function(e){

    if(e.target.classList.contains("delete-btn")){
        let index = e.target.getAttribute("data-index");
        uploads.splice(index, 1);
        localStorage.setItem("uploads", JSON.stringify(uploads));
        displayUploads();
    }
});



// BOOKMARKS


let bookmarkForm = document.querySelector(".bookmark-form");
let bookmarkList = document.querySelector(".bookmark-list");


// Load saved bookmarks
let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
displayBookmarks();


// Bookmark submit
bookmarkForm.addEventListener("submit", function(e){
    e.preventDefault();

    let title = bookmarkForm.querySelector("input[type='text']").value;
    let link = bookmarkForm.querySelector("input[type='url']").value;

    let bookmarkData = {
        title: title,
        link: link
    };

    bookmarks.push(bookmarkData);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

    displayBookmarks();
    bookmarkForm.reset();
});


// Display bookmarks
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


// Delete bookmark
bookmarkList.addEventListener("click", function(e){

    if(e.target.classList.contains("delete-btn")){
        let index = e.target.getAttribute("data-index");
        bookmarks.splice(index, 1);
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
        displayBookmarks();
    }
});


