import mongoose from "mongoose";
const Schema = mongoose.Schema;

const bankSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  account: {
    type: String,
    required: true,
  },
  bankid: {
    // banks list id
    type: String,
    required: true,
  },
  bank: {
    // bank_code
    type: String,
    required: true,
  },
  type: {
    // reciept type
    type: String,
    required: true,
  },
  currency: {
    // bank currency
    type: String,
    required: true,
  },

  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.models.bank || mongoose.model("bank", bankSchema);
