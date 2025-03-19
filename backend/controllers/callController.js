const Call = require('../models/Call'); 

// store a call response from front-end
const storeCallResponse = async (req, res) => {
  console.log('here');
  try {
    const {
      name,
      phone,
      date,
      time,
      duration,
      timeSpent,
      dialer,
      calledReceivedBy,
      disposition,
      remarks,
      notes,
      list,
      team,
      template,
      recording,
    } = req.body;

    const newCallResponse = new Call({
      name,
      phone,
      date,
      time,
      duration,
      timeSpent,
      dialer,
      calledReceivedBy,
      disposition,
      remarks,
      notes,
      list,
      team,
      template,
      recording,
    });

    await newCallResponse.save();

    res.status(201).json({
      success: true,
      message: 'Call response stored successfully',
      data: newCallResponse,
    });
  } catch (error) {
    console.error('Error storing call response:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to store call response',
      error: error.message,
    });
  }
};

module.exports = { storeCallResponse };