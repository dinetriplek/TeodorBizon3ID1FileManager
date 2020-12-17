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

 let fileTable = [], columns = ["id", "image", "name", "type", "size", "", "", ""]
 app.get("/fileManager", function(req, res){
    content = [fileTable,columns]
    res.render("fileManager.hbs",content)
 })

 app.get("/info", function(req, res){
  res.render("info.hbs")
})

 app.get("/info/:id", function(req, res){
   if(req.params.id == "0"){
     res.render("info.hbs", ["",false])
   } else {
     for(var i=0;i<fileTable.length;i++){
       if(fileTable[i].id == req.params.id){
         var obj = fileTable[i]
       }
     }
     res.render("info.hbs", [obj, true])
   }
 })

let index = 1
 app.post("/upload", function(req, res){
    let form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '/static/upload/'       
    form.keepExtensions = true                           
    form.multiples = true                                
    form.parse(req, function (err, fields, files) {
      if (err) {
        console.log(err)
        return
      }
       if(Array.isArray(files.files)){
         for(var i=0; i<files.files.length;i++){
            var obj = {}
            obj.id = index
            obj.name = files.files[i].name
            obj.path = files.files[i].path
            obj.size = files.files[i].size
            obj.type = files.files[i].type
            obj.genname = path.basename(files.files[i].path)
            obj.save_date = files.files[i].lastModifiedDate
            fileTable.push(obj)
            index++
         }
       } else {
         var obj = {}
         obj.id = index
         obj.name = files.files.name
         obj.path = files.files.path
         obj.size = files.files.size
         obj.type = files.files.type
         obj.genname = path.basename(files.files.path)
         obj.save_date = files.files.lastModifiedDate
         fileTable.push(obj)
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
