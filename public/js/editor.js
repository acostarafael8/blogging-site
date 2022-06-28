const blogTitleField = document.querySelector('.title');
const blogSynopseField = document.querySelector('.synopse');
const articleFeild = document.querySelector('.article');

// banner
const bannerImage = document.querySelector('#banner-upload');
const banner = document.querySelector(".banner");
let bannerPath;

const publishBtn = document.querySelector('.publish-btn');
const videBtn = document.querySelector('.vid-btn');
const uploadInput = document.querySelector('#image-upload');
const imgBtn = document.querySelector('.img-btn');

bannerImage.addEventListener('change', () => {
    uploadImage(bannerImage, "banner");
})

uploadInput.addEventListener('change', () => {
    uploadImage(uploadInput, "image");
})

const uploadImage = (uploadFile, uploadType) => {
    const [file] = uploadFile.files;
    if(file && file.type.includes("image")){
        const formdata = new FormData();
        formdata.append('image', file);
        fetch('/upload', {
            method: 'post',
            body: formdata
        }).then(res => res.json())
        .then(data => {
            if(uploadType == "image"){
                addImage(data, file.name);
            } else{
                bannerPath = `${location.origin}/${data}`;
                banner.style.backgroundImage = `url("${bannerPath}")`;
            }
        })
    } else{
        alert("upload Image only");
    }
}

const addImage = (imagepath, alt) => {
    insertImage(imagepath);
}

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

publishBtn.addEventListener('click', () => {
    // if(articleFeild.value.length && blogTitleField.value.length){
        // generating id
        let letters = 'abcdefghijklmnopqrstuvwxyz';
        let blogTitle = blogTitleField.value.split(" ").join("-");
        let id = '';
        for(let i = 0; i < 4; i++){
            id += letters[Math.floor(Math.random() * letters.length)];
        }

        // setting up docName
        let docName = `${blogTitle}-${id}`;
        let date = new Date(); // for published at info

        //access firstore with db variable;
        db.collection("blogs").doc(docName).set({
            title: blogTitleField.value,
            article: tinymce.get('mytextarea').getContent(),
            synopse:blogSynopseField.value,
            bannerImage: bannerPath,
            publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
        })
        .then(() => {
            location.href = `/${docName}`;
        })
        .catch((err) => {
            console.error(err);
        })
})


videBtn.addEventListener('click', ()=>{
    let videoId = prompt("Enter YouTube Video Id");
    insertYouTubeVideo(videoId);
})

const getAllServerImages=()=>{
    let images = [];
    fetch('/images').then(res => res.json()).then(data => {
        insertImagesIntoImagesModal(data.images);
        openImagesModalCentered();
    }
    )
}

imgBtn.addEventListener('click', ()=>{
    getAllServerImages();
}   )



const openModal=(modalId)=>{
    let modal = document.querySelector(modalId);
    modal.style.display = "block";
}

const openImagesModal=()=>{
    openModal("#img-modal");
}
/**
 * Function that inserts image into image modal, showing 4 images at each row.
 * Includes a button at each image to delete it from the modal.
 * @param {*} images array of images to insert
 */
const insertImagesIntoImagesModal=(images)=>{
    let imagesModal = document.querySelector("#img-modal");
    let imagesContainer = document.querySelector("#images-container");
    imagesContainer.innerHTML = "";
    let row = document.createElement("div");
    row.className = "row";
    imagesContainer.appendChild(row);
    let i = 0;
    images.forEach(image => {
        let imgPath = `uploads/${image.split('\\')[7]}`;
        let img = document.createElement("img");
        img.src = imgPath
        img.className = "img-thumbnail";
        img.style.width = "100px";
        img.style.height = "100px";
        img.style.margin = "10px";
        img.style.cursor = "pointer";
        img.addEventListener('click', () => {
            insertImage(imgPath);
            imagesModal.style.display = "none";
        }
        )
        let deleteBtn = document.createElement("button");
        deleteBtn.className = "btn btn-danger";
        deleteBtn.innerHTML = "Delete";
        deleteBtn.addEventListener('click', () => {
            deleteImage(image);
            imagesModal.style.display = "none";
        }
        )
        row.appendChild(img);
        row.appendChild(deleteBtn);
        i++;
        if(i % 4 == 0){
            row = document.createElement("div");
            row.className = "row";
            imagesContainer.appendChild(row);
        }
    }
    )


}

const deleteImage = (image) => {
    console.log
    fetch('/deleteImage', {
        headers: {'Content-Type': 'application/json'},
        method: 'post',
        body: JSON.stringify({
            image: image
        })
    }).then(res => res.json())
    .then(data => {
        closeImagesModal();
        getAllServerImages();
    }
    )
}

/*
Open a modal in front of every other element and center it on the screen
*/
openCenteredModal = (modalId) => { 
    let modal = document.querySelector(modalId);
    let modalClose = document.querySelector(modalId + '-close');
    modal.style.display = "block";
    let modalHeight = modal.offsetHeight;
    let modalWidth = modal.offsetWidth;
    let windowHeight = window.innerHeight;
    let windowWidth = window.innerWidth;
    let top = (windowHeight - modalHeight) / 2;
    let left = (windowWidth - modalWidth) / 2;
    modal.style.top = top + "px";
    modal.style.left = left + "px";
    modalClose.style.display = 'block'
    bringModalInFront(modalId);
}

/** 
 * Function that brings the modal in front of all other elements
 */
bringModalInFront = (modalId) => {
    let modal = document.querySelector(modalId);
    modal.style.zIndex = "100";
}

addCloseModalCentered = (modalId) => {
    let modal = document.querySelector(modalId);
    let closeBtn = document.createElement("span");
    closeBtn.className = "close";
    closeBtn.innerHTML = "&times;";
    modal.appendChild(closeBtn);
    closeBtn.onclick = () => {
        modal.style.display = "none";   // hide modal
    }}

openImagesModalCentered = () => {
    openCenteredModal("#img-modal");
}

const closeImagesModal = () => {
    let imagesModal = document.querySelector("#img-modal");
    let modalClose = document.querySelector("#img-modal-close");
    imagesModal.style.display = "none";
    modalClose.style.display = 'none'
}

const insertImage = (imagePath) => {
    tinymce.activeEditor.execCommand('InsertImage', false, imagePath);
}

const insertYouTubeVideo=(videoId)=>{
    tinymce
    .activeEditor
    .execCommand('mceInsertContent', false,
     `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
     );
}  


