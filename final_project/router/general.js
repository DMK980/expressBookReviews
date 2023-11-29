const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {

    let username = req.body.username;
    let password = req.body.password;

    if (!username || !password){

        return res.status(400).json({message: "Invalid username/password enter again"});

    }

    let usersFiltered = (username)=>{

        let usersCopy = users.filter((user)=> user.username === username)

        return usersCopy.length == 1;

    }

    if (usersFiltered(username)){

        return res.json({message: "User already exists please login"});

    } else {

        users.push({"username":username,"password":password});
        
        return res.json({message: "User created successfully"});

    }

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {

  let bookTitles = {}

  for (let i = 1; i < 11;i++){

      bookTitles[i]= books[i]["title"]
  }

  return res.status(300).send(JSON.stringify(bookTitles,null,4));
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

  let isbn = Number(req.params.isbn);

  if (isbn > 10 || isbn < 1){

      return res.status(400).json({message:"Enter an isbn between 1 - 10"});

  } else {

      return res.status(200).send(JSON.stringify(books[isbn]));

  }
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) { 
    
  let authorName = req.params.author;

  for (let key in books){

    if (books[key].author === authorName){

        return res.status(200).send(JSON.stringify(books[key]));

    }
    
  }

  return res.status(400).json({message:"Enter a valide author name"});

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

  let bookTitle = req.params.title;

  for (let key in books){

    if (books[key].title === bookTitle){

        return res.status(200).send(JSON.stringify(books[key]));

    }

  }

  return res.status(400).json({message:"Enter a valide book title"});

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {

  let isbnBookReviews = req.params.isbn;

  for (let key in books){

    if (key === isbnBookReviews){
        
        return res.status(200).json({reviews: books[key].reviews})

    }

  }

  return res.status(400).json({message: "Enter an isbn between 1 - 10"});

});

module.exports.general = public_users;
