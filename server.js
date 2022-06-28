const express = require('express');
const path = require('path');
const fileupload = require('express-fileupload');

let initial_path = path.join(__dirname, "public");

const app = express();
app.use(express.static(initial_path));
app.use(fileupload());
app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(path.join(initial_path, "home.html"));
})

app.get('/editor', (req, res) => {
    res.sendFile(path.join(initial_path, "editor.html"));
})

app.get('/images', (req, res) => {
    let images = getAllImages('C:\\Users\\Rafael\\Desktop\\blogging-site\\public\\uploads');
    console.log(images)
    res.json({images: images})
})

app.post('/deleteImage', (req, res) => {
    console.log("BODY: ",req.body.image)
    let image = req.body.image;
    deleteImage(image);
    res.json({message: "Image deleted"})
}
)

const deleteImage = (image) => {
    try {
        const fs = require("fs");
        let imagePath = ''+ image;
        fs.unlinkSync(imagePath);
        console.log("File removed:", path);
      } catch (err) {
        console.error(err);
      }
    }

const getAllImages = (dir) => {
    let images = [];
    let fs = require('fs');
    let files = fs.readdirSync(dir);
    files.forEach(file => {
        let filePath = path.join(dir, file);
        let stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            images = images.concat(getAllImages(filePath));
        } else if (filePath.match(/\.(jpg|jpeg|png|gif)$/)) {
            images.push(filePath);
        }
    });
    return images;
}

// upload link
app.post('/upload' , (req, res) => {
    let file = req.files.image;
    let date = new Date();
    // image name
    let imagename = date.getDate() + date.getTime() + file.name;
    // image upload path
    let path = 'public/uploads/' + imagename;

    // create upload
    file.mv(path, (err, result) => {
        if(err){
            console.log(err)
            throw err;
        } else{
            // our image upload path
            res.json(`uploads/${imagename}`)
        }
    })
})

app.get("/:blog", (req, res) => {
    res.sendFile(path.join(initial_path, "blog.html"));
})

app.use((req, res) => {
    res.json("404");
})

app.listen("3000", () => {
    console.log('listening......');
})