/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
const mongoose = require('mongoose');
const Book = require('../schema/Book')

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
      chai.request(server)
        .post('/api/books')
        .send({
          title: 'a test book'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, 'title', 'Books in array should contain title');
          assert.property(res.body, '_id', 'Books in array should contain _id');
          done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({}
          )
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no title provided');
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      });           
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
  
        chai.request(server)
          .get(`/api/books/1234`)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'not a valid id');
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db', async function(){
        const newBook = await Book.create({
          title: 'test book'
        })
         chai.request(server)
          .get(`/api/books/${newBook._id}`)
          .end(function(err, res){

            assert.equal(res.status, 200);
            assert.property(res.body, 'comments', 'Books in array should contain comments');
            assert.property(res.body, 'title', 'Books in array should contain title');
            assert.property(res.body, '_id', 'Books in array should contain _id');

          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', async function(){
        const newBook = await Book.create({
          title: 'test book'
        })
         chai.request(server)
          .post(`/api/books/${newBook._id}`)
          .send({comment: 'the first comment'})
          .send({comment: 'the second comment'})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            assert.equal(res.body[0].commentcount, 2)
 
          });
      });
      
    });

  });
});
