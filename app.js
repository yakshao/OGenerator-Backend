var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var multer = require('multer');
const port = process.env.PORT || 4000;
const { createCanvas, loadImage } = require('canvas');
const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadString, uploadBytes, getDownloadURL } = require('firebase/storage');
const { satori } = require('satori');
const url = require('url');
var admin = require("firebase-admin");
const { access } = require('fs');
require('dotenv').config();

var app = express();
app.use(cors())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var upload = multer.diskStorage({
  destination: function (req, file, cb) {
 
    cb(null, './')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
})

var storage = multer({ storage: upload });

const firebaseConfig = {
  apiKey: ######,
  authDomain: #######,
  projectId: #######,
  storageBucket: ########,
  messagingSenderId: #######,
  appId: #######,
  measurementId: ########
};

const app2 = initializeApp(firebaseConfig);
const bucket3 = getStorage()


app.get('/', function (req, res, next) {

  res.send('hi');
});

app.post('/genOG', storage.single('img'), async function (req, res) {

 
  const imgCanvas = createCanvas(1200, 630);
  const crx = imgCanvas.getContext('2d');

  const logo = await loadImage(__dirname + '/' + 'logoMedColored.png');
  
    crx.fillStyle = '#FFFFFF';
    crx.fillRect( 0, 0, 1200, 630)
    crx.fillStyle = '#FAEDCE';

    crx.roundRect(30, 20, 1140, 590, 20)
    crx.stroke();
    crx.fill();
    crx.strokeStyle= '#000000'
    

    if (req.file != undefined){

    const toBeDrawnImg = await loadImage(__dirname + '/' + req.file.filename);
      crx.drawImage( toBeDrawnImg, 900, 280, 200, 200)

      crx.moveTo(100, 275);
      crx.beginPath();
       crx.arc(1000, 380, 120, 0, 2 * Math.PI, true);
      crx.closePath();
      crx.lineWidth = 50;
      crx.strokeStyle = '#FAEDCE';
      crx.stroke();
    
     }

     
  crx.drawImage(logo,  80, 50, 100, 90)

  crx.font = '600 75px OpenSans'

  crx.fillStyle = '#000000';

  let titleSlice = req.body.title.slice(0, 20) + '...';

  

  crx.fillText(titleSlice, 80, 230)
  // crx.fillStyle = '#000000';

 // crx.fillRect(50, 450, 1100, 150)

 // crx.font = '600 80px OpenSans'
let accu = [];
let eightString = '';
let number = 0;
     let textSplit = req.body.content.split(' ');

     if(textSplit.length>= 7){
      for (i=number; i<textSplit.length; i++){
        eightString = eightString + ' ' + textSplit[i];
        if(i!=0 && i%7==0){
         accu.push(eightString.trim());
         eightString= '';
        }
      }
    }else{
      accu.push(textSplit.join(' '))
    }
console.log(accu)


  crx.fillStyle = '#000000';
  crx.font = '500 30px OpenSans'
  let top = 300;
  let nOfLines = Math.min(5, accu.length)

  for(i= 0; i< nOfLines; i++){
    crx.fillText(accu[i], 90, top);
    top =   top + 50
  }
  console.log(nOfLines)
  crx.fillText('...', 90, top);



  const message4 = imgCanvas.toDataURL('image/jpeg');
  const name = req.file?.filename? `${req.file.filename}` :'akshay'

  try {
    const storageRef = ref(bucket3, name);
    await uploadString(storageRef, message4, 'data_url');
    const urlT = await getDownloadURL(storageRef);
    res.send({ url: urlT })

  } catch (err) {
    res.send(err)

  }


  //  const fileRef = getStorage().bucket().file(req.file.filename);


});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = app;
