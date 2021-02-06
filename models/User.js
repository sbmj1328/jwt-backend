const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * User Schema
 */
const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

/**
 * USer Model
 */
const User = mongoose.model('user', UserSchema);

module.exports = User;
