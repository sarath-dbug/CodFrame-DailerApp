const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  number: { 
    type: String, 
    required: true, 
    unique: true 
  },
  secondaryNumber: { 
    type: String, 
    default: '' 
  },
  name: { 
    type: String, 
    required: true 
  },
  companyName: { 
    type: String, 
    default: '' 
  },
  disposition: { 
    type: String, 
    enum: ['NEW', 'CONTACTED', 'FOLLOW_UP', 'COMPLETED', 'MISSED'], 
    default: 'NEW' 
  },
  address: { 
    type: String, 
    default: '' 
  },
  extra: { 
    type: String, 
    default: '' 
  },
  remarks: { 
    type: String, 
    default: '' 
  },
  note: { 
    type: String, 
    default: '' 
  },
  createdOn: { 
    type: Date, 
    default: Date.now 
  },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    default: null 
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'COMPLETED', 'MISSED'], 
    default: 'PENDING' 
  }
});

module.exports = mongoose.model('Contact', contactSchema);