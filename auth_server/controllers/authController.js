const User = require("../models/User");
const jwt = require('jsonwebtoken');


// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };
  
    // incorrect email
    if (err.message === 'incorrect email') {
      errors.email = 'That email is not registered';
    }
  
    // incorrect password
    if (err.message === 'incorrect password') {
      errors.password = 'That password is incorrect';
    }
  
    // duplicate email error
    if (err.code === 11000) {
      errors.email = 'that email is already registered';
      return errors;
    }
  
    // validation errors
    if (err.message.includes('user validation failed')) {
      Object.values(err.errors).forEach(({ properties }) => {
        errors[properties.path] = properties.message;
      });
    }
    return errors;
  }

  
// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id, email) => {
  return jwt.sign({ id, email }, 'secret key', {
    expiresIn: maxAge
  });
};


module.exports.signup_post = async (request, response) => {
  const { email, password } = request.body;
  //email = "itayhau@gmail.com"
  //password = "123456"

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id, email);
    response.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    response.status(201).json({ user: user._id });
  }
  catch(err) {
    res.cookie('jwt', '', { maxAge: 1 });
    const errors = handleErrors(err);
    response.status(400).json({ errors });
  }
 
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id, email);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } 
  catch (err) {
    res.cookie('jwt', '', { maxAge: 1 });
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.status(200).json({ status: "logged out"});
}

module.exports.get_protected_data = (req, res) => {
    const token = req.cookies.jwt;
    if (!token) {
        console.log('401');
        res.status(401).json({"status": "no jwt present"})
        return;
    }
    console.log(token);
    jwt.verify(token, 'secret key', async (err, decodedToken) => {
        if (err) {
            console.log('402');
            res.status(401).json({"status": "token not valid!"})
            return;
        } else {
            // valid token
            // check if this user is still in the db
          let user = await User.findById(decodedToken.id);
          console.log('200');
          res.status(200).json({ status: "protected data achieved"});
          return;
        }
      });
    //   res.status(401).json({"status": "token not valid!"})
    //   return;
}