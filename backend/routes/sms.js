import express from 'express';
import axios from 'axios';
import SMS from '../models/SMS.js';

const router = express.Router();

// Send SMS endpoint
router.post('/send', async (req, res) => {
  try {
    const { name, phone, message } = req.body;

    // Validate input
    if (!name || !phone || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Format message with brand
    const brandedMessage = `[SoftwaresByPete] ${message}`;

    // Celcom Africa API payload
    const payload = {
      apikey: process.env.CELCOM_API_KEY || 'b4e69853162316c2db235c8a444eb265',
      partnerID: process.env.CELCOM_PARTNER_ID || '36',
      message: brandedMessage,
      shortcode: 'TEXTME',
      mobile: phone.replace(/[^0-9+]/g, '')
    };

    // Send SMS via Celcom Africa API
    const response = await axios.post(
      'https://isms.celcomafrica.com/api/services/sendsms',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    // Save to database
    const smsRecord = new SMS({
      name,
      phone: payload.mobile,
      message: brandedMessage,
      apiResponse: response.data,
      status: response.data.responses?.[0]?.['message-id'] ? 'success' : 'failed'
    });

    await smsRecord.save();

    if (response.data.responses?.[0]?.['message-id']) {
      res.json({
        success: true,
        message: 'SMS sent successfully!',
        messageId: response.data.responses[0]['message-id']
      });
    } else {
      throw new Error(response.data.responses?.[0]?.text || 'Failed to send SMS');
    }

  } catch (error) {
    console.error('SMS sending error:', error);
    res.status(500).json({
      success: false,
      error: error.response?.data?.message || error.message
    });
  }
});

// Get SMS logs
router.get('/logs', async (req, res) => {
  try {
    const logs = await SMS.find().sort({ createdAt: -1 }).limit(50);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

export default router;