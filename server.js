const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const PORT = process.env.PORT || 3000;
const app = express()
const hbs = require('express-handlebars')
const formidable = require('formidable');

app.use(express.static('static'))
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));       
app.engine('hbs', hbs({
    defaultLayout: 'main.hbs',
    extname: '.hbs', 
    partialsDir: "views/partials",
    helpers: {
      imageExtension: function (type) {
        switch (type) {
          case "text/plain":
              return "/gfx/txt.png"
            break;
          case "image/jpeg":
              return "/gfx/jpg.png"
            break;
          case "image/png":
              return "/gfx/png.png"
            break;
          case "image/gif":
              return "/gfx/gif.png"
            break;
          case "audio/mpeg":
              return "/gfx/mp3.png"
            break;
          case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
              return "/gfx/doc.png"
            break;
          case "application/pdf":
              return "/gfx/pdf.png"
            break;
          case "application/zip":
              return "/gfx/zip.png"
            break;
          default:
            return "/gfx/other.png"
        }}}}));  
app.set('view engine', 'hbs');

app.get("/", function(req, res){
    res.render("upload.hbs")
 })

 let fileTable = []
 app.get("/fileManager", function(req, res){
    res.render("fileManager.hbs",{ fileTable })
 })

 app.get("/info", function(req, res){
  res.render("info.hbs")
})

 app.get("/info/:id", function(req, res){
   if(req.params.id == "0"){
     res.render("info.hbs", ["",false])
   } else {
       fileTable.forEach((element) => {
         if (element.id == req.params.id) {
          res.render("info.hbs", [element, true])
         }
       })
     }
   })

let index = 1
 app.post("/upload", (req, res) => {
    let form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '/static/upload/'       
    form.keepExtensions = true                           
    form.multiples = true

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.log(err)
        return
      }
       if(Array.isArray(files.fileToUpload)){
         files.fileToUpload.forEach((element) => {
          fileTable.push({ id: index, name: element.name, path: element.path, size: element.size, type: element.type, genname: path.basename(element.path), save_date: element.lastModifiedDate  })
          index++
         })
       }
       else {
        fileTable.push({ id: index, name: files.fileToUpload.name, path: files.fileToUpload.path, size: files.fileToUpload.size, type: files.fileToUpload.type, genname: path.basename(files.fileToUpload.path), save_date: files.fileToUpload.lastModifiedDate  })
        index++    
      }
    });
   res.redirect("/")
 })

 app.post("/delete/:id", function(req,res){
   let newTable = []
   for(var i=0;i<fileTable.length;i++){
     if(fileTable[i].id != req.params.id){
       newTable.push(fileTable[i])
     }
}
   fileTable = newTable
   res.redirect("/fileManager")
 })

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT )
})
