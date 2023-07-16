const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
  password: {
    type: String,
    required: [true, 'Set password for user'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ['starter', 'pro', 'business'],
    default: 'starter',
  },
  token: String,
  avatarURL: String,
});

userSchema.pre('save', async function (next) {
  if (this.isNew) {
    const emailHash = crypto.createHash('md5').update(this.email).digest('hex');

    this.avatarURL = `https://gravatar.com/avatar/${emailHash}.jpg?d=identicon`;
  }

  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.checkPassword = (candidate, hash) => bcrypt.compare(candidate, hash);

const User = mongoose.model('User', userSchema);

module.exports = User;
