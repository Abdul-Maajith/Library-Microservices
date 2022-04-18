const express = require("express");
const app = express();

// To get a body
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Loading Mongoose:
const mongoose = require("mongoose");

// Connecting MongoDB
const dbUrl =
  "mongodb+srv://AbdulMaajith:test@cluster0.dgwac.mongodb.net/customer?retryWrites=true&w=majority";

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
require("./customerModel");
const Customer = mongoose.model("Customer");

// Routes
// To create a new customer
app.post("/customer", async (req, res) => {
    try {
        let newCustomer = {
          name: req.body.name,
          age: req.body.age,
          address: req.body.address,
        };

        // Creating a customer
        const customer = new Customer(newCustomer);

        await customer.save();
        res.status(201).json({
          Message: "New customer successfully created!",
        });
    } catch (error) {
        console.log(error);
    }
})

// Getting all the Books 
app.get("/customers", async (req, res) => {
  try {
    await Customer.find().then((customer) => {
      res.status(200).json({
        customers: customer,
      });
    });
  } catch (error) {
    console.log(error);
  }
})

// Getting a customer by its ID
app.get("/customer/:_id", async (req, res) => {
  try {
    const { _id } = req.params;

    await Customer.findById(_id).then((customer) => {
      if (customer) {
        res.status(200).json({
          customer,
        });
      } else {
        res.status(400).json({
          Message: "No customers Found!",
        });
      }
    });

  } catch (error) {
    console.log(error);
  }
})

// Deleting a customer
app.delete("/customer/:_id", async (req, res) => {
  try {
    const { _id } = req.params;

    await Customer.findByIdAndRemove(_id)
      .then(() => {
        res.status(200).json({
          Message: "Deleted Successfully",
        });
      })
      .catch(() => {
        res.status(400).json({
          Message: "Deletion Cannot be done!",
        });
      });

  } catch (error) {
    console.log(error);
  }
})

app.listen("5001", () => {
    console.log("Server is listening on the port 5001");
})