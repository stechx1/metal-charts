const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    sellerId: {
      type: String
    },
    buyerId: {
      type: String
    },
    amount: {
      type: Number,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
    },
    // type of commodity
    commodity: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  {timestamps: true}
);


export default mongoose.models.order || mongoose.model("order", OrderSchema);