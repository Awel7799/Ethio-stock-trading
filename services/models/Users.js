const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  fullName: {
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
      required: true,
    },
  },

  phoneNumber: {
    type: String,
    required: true,
  },

  address: {
    region: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    subcity: {
      type: String,
    },
    woreda: {
      type: String,
    },
    kebele: {
      type: String,
    },
    houseNumber: {
      type: String,
    },
  },

  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
    default: 'ACTIVE',
  },

  role: {
    type: String,
    enum: ['USER', 'ADMIN'],
    default: 'USER',
  },

  preferences: {
    language: {
      type: String,
      default: 'en',
    },
    currency: {
      type: String,
      default: 'ETB',
    },
    notifications: {
      email: {
        type: Boolean,
        default: true,
      },
      sms: {
        type: Boolean,
        default: true,
      },
      push: {
        type: Boolean,
        default: false,
      },
    },
  },

  loginAttempts: {
    type: Number,
    default: 0,
  },

  accountLocked: {
    type: Boolean,
    default: false,
  },
},
{
  timestamps: true, // Automatically adds createdAt and updatedAt
}
);

module.exports = mongoose.model('Users', userSchema);
