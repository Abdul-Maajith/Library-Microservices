const mongoose = require("mongoose");

mongoose.model("Order", {
  CustomerID: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  BookID: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  initialDate: {
    type: Date,
    require: true,
  },
  deliveryDate: {
    type: Date,
    require: true,
  },
});