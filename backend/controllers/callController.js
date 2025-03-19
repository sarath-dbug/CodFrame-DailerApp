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


// Fetching all call responses
const getAllCallResponses = async (req, res) => {
  try {
    const callResponses = await Call.find();

    res.status(200).json({
      success: true,
      message: 'Call responses fetched successfully',
      data: callResponses,
    });
  } catch (error) {
    console.error('Error fetching call responses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch call responses',
      error: error.message,
    });
  }
};


module.exports = { 
  storeCallResponse,
  getAllCallResponses
};