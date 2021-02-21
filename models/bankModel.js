const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A bank must have a name!'],
    unique: true,
  },
  interest: {
    type: Number,
    required: [true, 'A bank must have an interest rate!'],
    default: 10,
  },
  maxLoan: {
    type: Number,
    required: [true, 'A bank must have a max loan value!'],
    default: 200000,
  },
  minDownPayment: {
    type: Number,
    required: [true, 'A bank must have a min dow payment value!'],
    default: 20,
  },
  term: {
    type: Number,
    required: [true, 'A bank must have a loan term value!'],
    default: 120,
  },
});

const Bank = mongoose.model('Bank', bankSchema);

module.exports = Bank;
