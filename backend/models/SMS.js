import mongoose from 'mongoose';

const smsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['success', 'failed'],
    required: true
  },
  apiResponse: {
    type: Object,
    required: true
  },
  messageId: String
}, {
  timestamps: true
});

export default mongoose.model('SMS', smsSchema);