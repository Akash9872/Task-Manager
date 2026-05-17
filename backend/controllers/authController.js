const User = require('../models/User');
const jwt = require('jsonwebtoken');

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const mapDbError = (err) => {
  const m = String(err?.message || '');
  if (/buffering timed out|Connection operation buffering|Server selection timed out|not connected|ECONNREFUSED|MongoNetworkError|before initial connection/i.test(m)) {
    return {
      status: 503,
      error:
        'Database is offline or unreachable. Start MongoDB on your PC, or set MONGODB_URI in backend/.env (MongoDB Atlas works), then restart the API.',
    };
  }
  return { status: 500, error: m || 'Something went wrong' };
};

const signup = async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password ?? '').trim();

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = new User({ name, email, password, role: 'Member' });
    await user.save();

    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    const { status, error: message } = mapDbError(error);
    res.status(status).json({ error: message });
  }
};

const login = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password ?? '');

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Must match stored email (lowercase); legacy mixed-case rows still resolve
    let user = await User.findOne({ email }).select('name email role password');
    if (!user) {
      user = await User.findOne({
        email: { $regex: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
      }).select('name email role password');
    }
    if (!user) {
      return res.status(400).json({
        error: 'No account for this email. Please sign up first, then sign in.',
      });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: 'Incorrect password. Try again or sign up if you are new.' });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    const { status, error: message } = mapDbError(error);
    res.status(status).json({ error: message });
  }
};

module.exports = { signup, login };
