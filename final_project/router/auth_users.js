const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 

    let usersCopy = users.filter((user)=> user.username === username)

        return usersCopy.length == 1;
}

const authenticatedUser = (username,password)=>{ 

    let usersCopy = users.filter((user)=> {

        return (user.username === username && user.password == password)

    })
    
    return usersCopy.length == 1;

}

//only registered users can login
regd_users.post("/login", (req,res) => {

    let username = req.body.username;
    let password = req.body.password;

    if (!username || !password){

        return res.status(404).json({message:"Error"});

    }

    if (authenticatedUser(username,password)){

        let accessToken = jwt.sign({data:password},"access",{expiresIn: 60 * 60});

        req.session.authorization = {accessToken,username};

        return res.status(200).json({message:"User succesfully logged in"})

    } else {
        
        return res.status(208).json({message: "Invalid username/password try again"});
    
    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  
  let username = req.body.username;
  let isbn = req.params.isbn;
  let review = req.query.review;

  for (let key in books){

      if (key === isbn){

        books[key].review[`${username}`] = review

      }

  }

  return res.status(200).json({message: "Book Review added"});

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
