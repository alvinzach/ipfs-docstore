
const express = require('express')
const fs = require('fs')
const multer=require('multer')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname)
    }
  })
   
var upload = multer({ storage: storage })
const IPFS = require('ipfs-mini')
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })


app.post('/addfile',upload.single('file'),function(req, res) {
    console.log(req.file.path)
    var doc=fs.readFileSync(req.file.path)
    var docBuffer=new Buffer(doc)
    ipfs.addJSON({path:req.file.path,type:req.file.mimetype,content:docBuffer}, function (err, result) {
        if (err) {
            res.json({status:400,error:err})
        }else{
            fs.unlinkSync(req.file.path)
            res.json({status:200,hash:result})
        }
      })

})
app.post('/getfile', function(req, res) {
    console.log(req.body.hash)
    ipfs.catJSON(req.body.hash,function (err, doc) {
        if (err) {
            console.log(err)
            res.json({status:400,error:err.toString()})
        }else{
            fs.writeFileSync(doc.path,Buffer(doc.content.data))
            res.download(doc.path)
        }
      })

})

app.listen(3000, () => console.log('App listening on port 3000'))
