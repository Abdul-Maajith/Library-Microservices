const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

// To get a body
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Loading Mongoose:
const mongoose = require("mongoose");

// Connecting MongoDB
const dbUrl = "mongodb+srv://AbdulMaajith:test@cluster0.ynrkh.mongodb.net/Bookservices?retryWrites=true&w=majority";

mongoose.connect(
  dbUrl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("connected to database myDb ;)");
  }
);

// Importing the MongoDB model
require("./bookModel");
const Book = mongoose.model("Book");

app.get("/", (req, res) => {
    res.send("This is the books services"); 
});

// Create a book func()
app.post("/book", async (req, res) => {
  try {
    let newBook = {
      title: req.body.title,
      author: req.body.author,
      numberPages: req.body.numberPages,
      publisher: req.body.publisher,
    };

    // Creating a newBook
    const book = new Book(newBook);

    await book.save();
    res.status(201).json({
      Message: "New book successfully created!",
    });
      
  } catch (error) {
    console.log(error);
  }
})

// Getting all the Books 
app.get("/books", async (req, res) => {
  try {
    await Book.find().then((books) => {
      res.status(200).json({
        Books: books,
      });
    });
  } catch (error) {
    console.log(error);
  }
})

// Getting a book by its ID
app.get("/book/:_id", async (req, res) => {
  try {
    const { _id } = req.params;

    await Book.findById(_id).then((book) => {
      if(book){
        res.status(200).json({
          book
        })
      } else {
        res.status(400).json({
          Message: "No books Found!"
        });
      }
    })

  } catch (error) {
    console.log(error);
  }
})

// Deleting a books
app.delete("/book/:_id", async (req, res) => {
  try {
    const { _id } = req.params;

    await Book.findByIdAndRemove(_id).then(() => {
      res.status(200).json({
        Message: "Deleted Successfully"
      }).catch(() => {
        res.status(400).json({
          Message: "Deletion Cannot be done!",
        });
      })
    })

  } catch (error) {
    console.log(error);
  }
})

app.listen(port, () => {
    console.log(`App is listening on the port ${port}`)
});