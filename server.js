const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const routes = require("./routes/api");
const users = require("./routes/api");
const app = express();
require('dotenv').config();
const CreateTripModel = require("./models/CreateTrip.js");

//ADDED NEW STUFF START
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const crypto = require("crypto");
//ADDED NEW STUFF END

// DB Config
const db = process.env.mongoURI;
//const db = "mongodb+srv://user_atlas:KaP23G43H5JjcPm@cluster0.lhnjo.mongodb.net/Pitchit?retryWrites=true&w=majority";

const apiKey = process.env.apiKey;

// Connect to MongoDB
mongoose.connect(
  db , {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(() => 
//ADDED NEW STUFF START
{
 gfs = Grid(mongoose.connection.db, mongoose.mongo)
 gfs.collection('uploads')
 console.log("MongoDB successfully connected", db)
})
//ADDED NEW STUFF END
.catch(err => console.log(err + "Error while connecting to mongo !!!!"));

// }).then(() => console.log("MongoDB successfully connected", db))
// .catch(err => console.log(err + "Error while connecting to mongo !!!!"));

// Bodyparser middleware
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(cors());

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);
app.use("/api", routes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });

}

// const root = require('path').join(__dirname, 'client', 'build')
// app.use(express.static(root));
// app.get("*", (req, res) => {
//     res.sendFile('index.html', { root });
// })


app.post("/api/create", (req, res) => {
  console.log(req.body);
  CreateTripModel.create(req.body)
  .then(dbCreateTrip => {
    console.log(dbCreateTrip);
    res.json(dbCreateTrip);
  })
  .catch(err => {
    console.log(err);
    res.send(err);
  });
});

app.get('/api/all', function(req, res){
  CreateTripModel.find()
    .exec()
    .then(doc => {
      res.send(doc);
    })
    .catch()
});

app.get('/api/completed', function(req, res){
  CreateTripModel.find({ completed: true })
    .exec()
    .then(doc => {
      res.send(doc)
    })
    .catch()
});

//NOT DONE
app.get('/api/update/:id', function(req, res) {
  CreateTripModel.updateOne({ _id: ':id' }, { $set: { completed: true } }, { upsert: false })
    .exec()
    .then(doc => {
      res.send(doc)
    })
    .catch()
});
//NOT DONE

app.post("/api/forma", (req, res)=>{
  const sgMail = require('@sendgrid/mail')
  console.log(req.body.name, req.body.lastname, req.body.email, req.body.message);
  sgMail.setApiKey(apiKey)
  const msg = {
  to: req.body.email,// Change to your recipient
  from: 'haroldzuluaga@aol.com', // Change to your verified sender
  subject: 'This is a support ticket for Pitchit',
  text: req.body.message,
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
console.log(msg);
// sgMail
//   .send(msg)
//   .then(() => {
//     res.send('Email sent2')
//   })
//   .catch((error) => {
//     res.send(error)
//   })
});


//ADDED NEW STUFF START
// Create storage engine
const storage = new GridFsStorage({
  url: db,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err)
        }
        const filename = file.originalname
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads',
        }
        resolve(fileInfo)
      })
    })
  },
})

const upload = multer({ storage })

app.post('/', upload.single('img'), (req, res, err) => {
  if (err) throw err
  res.status(201).send()
})

let gfs;

app.get('/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists',
      })
    }

    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename)
      readstream.pipe(res)
    } else {
      res.status(404).json({
        err: 'Not an image',
      })
    }
  })
})
//ADDED NEW STUFF END

// if (process.env.NODE_ENV === 'production') {
//   // Exprees will serve up production assets
//   app.use(express.static('build'));

//   // Express serve up index.html file if it doesn't recognize route
//   // const path = require('path');
//   app.use(routes)
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//   });
// };

const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server up and running on port ${port} !`));

