const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Admin', 'Member'],
    default: 'Member',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { bufferCommands: false });

// Hash password before saving (Mongoose 9: async hooks must not call next())
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const plain = String(this.password ?? '');
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(plain, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (password) {
  const hash = this.password;
  if (!hash || typeof hash !== 'string') return false;
  return bcrypt.compare(String(password ?? ''), hash);
};

module.exports = mongoose.model('User', userSchema);
