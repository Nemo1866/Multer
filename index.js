const express=require("express")
const app=express()
const path=require("path")
const multer=require("multer")


const ejs=require("ejs")

app.use(express.static("./public"))

app.set("view engine","ejs")

const storage=multer.diskStorage({
    destination:"./public/uploads/",
    filename:function(req,file,cb){
        cb(null,file.fieldname+"-"+Date.now()+path.extname(file.originalname))
    }
})

const upload=multer({
    storage:storage,
    limits:{fileSize:1000000},
    fileFilter:function(req,file,cb){
        checkFile(file,cb)
    }
}).single('multer')

function checkFile(file,cb){
    let filetypes=/jpeg|jpg|png/

    let fileExt=filetypes.test(path.extname(file.originalname).toLowerCase())

    let fileMime=filetypes.test(file.mimetype)

    if(fileExt && fileMime){
        cb(null,true)
    }else{
        cb("Error Images Only")
    }
}

app.get("/",(req,res)=>{
    res.render("index",)
})

app.post("/upload",(req,res)=>{
    upload(req,res,(err)=>{
        if(err){
            res.render("index",{
                msg:err
            })
        }else{
           if(req.file==undefined){
            res.render("index",{msg:"Error : No file Selected!"})
           }else{
            res.render("index",{
                msg:"File Uploaded!",
                file:`uploads/${req.file.filename}`
            })
           }
        }
    })
})


app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})