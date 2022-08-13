import mongoose from "mongoose";
import { string } from "yup";
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  paye: {
    //who made payment - user token
    type: String,
    required: true,
  },
  trx: {
    //paystack reference id
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.models.payment ||
  mongoose.model("payment", paymentSchema);
