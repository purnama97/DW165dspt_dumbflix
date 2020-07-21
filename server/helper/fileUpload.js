const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, __dirname+'../../../public/images')  //destination untuk menyimpan file di server
      },
      filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}`+path.extname(file.originalname)) //generate nama filenya kale pake fungsi filename hasilnya akan undifind
      }
})

const fileUpload=multer({
    storage : storage,
    fileFilter : function(req,file,cb){
        fileTypeCheck(file,cb)
    }
}).single('image')  
//image adalah key dari request filenya

function fileTypeCheck(file, cb){
    console.log(file)
    const types = /jpeg|jpg|png/   //regex
    const extname = types.test(path.extname(file.originalname).toLowerCase()) //membandingkan  type extension toLowercase di gunakan karena types nya huruf kecil
    const mimetype = types.test(file.mimetype) //extenstion sama akan mereturn boolean
    //path.extname ngambil extentionnya
    if (mimetype && extname){
        return cb(null,true)  // jika tidak ada error maka return true agar bisa di upload
    }else{
        cb('Error: file must be image') 
    }
}

module.exports = fileUpload
