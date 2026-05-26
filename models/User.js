const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: ['customer', 'driver', 'manager'],
      default: 'customer',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otpCodeHash: {
      type: String,
      select: false,
      default: null,
    },
    otpExpiresAt: {
      type: Date,
      select: false,
      default: null,
    },
    otpLastSentAt: {
      type: Date,
      default: null,
    },
    otpAttempts: {
      type: Number,
      default: 0,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    phone: {
  type: String,
  default: "",
},

vehicleType: {
  type: String,
  default: "",
},

vehicleNumber: {
  type: String,
  default: "",
},

licenseNumber: {
  type: String,
  default: "",
},

isApproved: {
  type: Boolean,
  default: true,
},

isOnline: {
  type: Boolean,
  default: false,
},
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
