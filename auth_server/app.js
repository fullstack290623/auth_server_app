
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRouter');
const cookieParser = require('cookie-parser');
//const { requireAuth, checkUser } = require('./middleware/authMiddleware')

const app = express(); const port = 8080

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

const dbURI = "mongodb://root:rootpassword@localhost:27022/node-auth?authSource=admin";
//const dbURI = `mongodb://${config.mongo.user_name}:${config.mongo.user_password}@localhost:27022/node-auth?authSource=admin`;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => {
    console.log('Mongo connected ...');
    console.log(result.connection._connectionString)    
    app.listen(3000, () => console.log(`Listening to port ${3000}`))
  })
  .catch((err) => console.log(err));

  app.use(authRoutes);