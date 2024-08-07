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
  apiKey: ########
  authDomain: #########
  projectId: ######
  storageBucket:######
  messagingSenderId:#######
  appId: #########
  measurementId: ########
};

const app2 = initializeApp(firebaseConfig);
const bucket3 = getStorage()


app.get('/', function (req, res, next) {

  res.send('hi');
});

app.post('/genOG', storage.single('img'), async function (req, res) {

  const svg = await satori(
    <div style={{ color: 'black' }}>hello, world</div>,
    {
      width: 600,
      height: 400,
      fonts: [
        {
          name: 'Roboto',
          // Use `fs` (Node.js only) or `fetch` to read the font as Buffer/ArrayBuffer and provide `data` here.
          data: robotoArrayBuffer,
          weight: 400,
          style: 'normal',
        },
      ],
    },
  )

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