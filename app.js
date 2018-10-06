
const express = require('express');
const fs = require('fs');
var bodyParser = require('body-parser')
var app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const IPFS = require('ipfs-mini');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });


app.post('/addfile', function(req, res) {
    let testFile = fs.readFileSync(req.body.path);
    let testBuffer = new Buffer(testFile);
    ipfs.addJSON({path:req.body.path,content:testBuffer}, function (err, result) {
        if (err) {
            res.json({status:400,error:err})
        }else{
            fs.unlinkSync(req.body.path)
            res.json({status:200,hash:result})
        }
      })

})
app.post('/getfile', function(req, res) {
    
    ipfs.catJSON(req.body.hash, function (err, files) {
        if (err) {
            res.json({status:400,error:err})
        }else{
            fs.writeFileSync(files.path,Buffer(files.content.data))
            res.json({status:200,path:files.path})
        }
      })

})

app.listen(3000, () => console.log('App listening on port 3000'))
