import mongoose from "mongoose";

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
  },
  purchase_datetime: new Date().toDateString(),
  amount: Number,
  purchaser: String,
});

export const ticketModel = mongoose.model(ticketCollection, ticketSchema);
