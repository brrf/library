/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
const mongoose = require('mongoose');
const Book = require('../schema/Book')
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      let collection = []
      let books = await Book.find({}, (err, books) => {
        if (err) console.log('error retrieving books');
        books.forEach( (book) => {
          book = book.toJSON()
          delete book.id
          collection.push(book)
        })
        res.json(collection);
      })
     

      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(async function (req, res){
      var title = req.body.title;
      try {
        const newBook = await Book.create({title});
        res.json({
          title: newBook.title,
          _id: newBook._id
        })
      }
      catch {
        console.log('an error occured. could not save new book')
      }  
    })
    
    .delete(async function(req, res){
      await Book.deleteMany({}, (err, response) => {
        if (err) console.log('couldn\'t delete');
        else res.send('complete delete successful')
      });

    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      var bookid = req.params.id;
      await Book.findById(bookid, (err, book) => {
        if (err) {
           res.send('no book exists')
        } else {
        res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments
          })    
       }
      })
    })
    
    .post(async function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      const book = await Book.findByIdAndUpdate(bookid, {$push: {comments: comment}}, {new: true});
      res.json({
        _id: book._id,
        title: book.title,
        comments: book.comments
      })
    })
    
    .delete(async function(req, res){
      var bookid = req.params.id;
      const book = await Book.findByIdAndDelete(bookid);
      if (!book) {
        console.log('an error occured')
      } else {
        res.send('delete successful')
      }
    });
  
};
