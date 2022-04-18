const express = require("express");
const app = express();

// Importing Axios
const axios = require("axios");

// Loading Mongoose:
const mongoose = require("mongoose");

// To get a body
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Connecting MongoDB
const dbUrl =
  "mongodb+srv://AbdulMaajith:test@cluster0.ik5rj.mongodb.net/Orders?retryWrites=true&w=majority";

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
require("./orderModel");
const Order = mongoose.model("Order");

// Routes
// Creating a new Order
app.post("/order", async (req, res) => {
    try {
        let newOrder = {
          CustomerID: mongoose.Types.ObjectId(req.body.CustomerID),
          BookID: mongoose.Types.ObjectId(req.body.BookID),
          initialDate: req.body.initialDate,
          deliveryDate: req.body.deliveryDate,
        };

        // Creating a order
        const order = new Order(newOrder);

        await order.save();
        res.status(201).json({
          Message: "New order successfully created!",
        });
    } catch (error) {
        console.log(error);
    }
})

// Getting all the orders
app.get("/orders", async (req, res) => {
  try {
    await Order.find().then((order) => {
      res.status(200).json({
        orders: order,
      });
    });
  } catch (error) {
    console.log(error);
  }
})

// Interaction with other services(Api's) with the help of Axios
app.get("/order/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    
    await Order.findById(_id).then((order) => {
      if (order) {
        axios.get(`http://localhost:5001/customer/${order.CustomerID}`).then((resp) => {
          
          let orderObj = {
            customerName: resp.data.customer.name,
            bookTitle: "",
          };

          axios.get(`http://localhost:5000/book/${order.BookID}`).then((resp) => {
            orderObj["bookTitle"] = resp.data.book.title;
            res.status(200).json(orderObj);
          })

        })

      } else {
        res.status(400).json({
          Message: "No Orders Found!",
        });
      }
    });

  } catch (error) {
    console.log(error);
  }
})

app.listen("5002", () => {
  console.log("Server is listening on the port 5002");
});