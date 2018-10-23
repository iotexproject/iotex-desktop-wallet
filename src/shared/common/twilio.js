/* eslint-disable no-process-env,no-undef */
require('dotenv').config();
import {logger} from '../../lib/integrated-gateways/logger';

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;
const onCallNumber = process.env.ON_CALL_NUMBER;

const Twilio = require('twilio');
let client = null;

function initClient() {
  if (accountSid === undefined || authToken === undefined) {
    logger.warn('Missing API keys for Twilio');
    return;
  }
  if (client !== null) {
    return;
  }

  try {
    client = new Twilio(accountSid, authToken);
  } catch (error) {
    logger.error(error);
  }
}

function sendSMS(to, msg) {
  return client.messages.create({
    body: msg,
    to,
    from: `+${twilioNumber}`,
  })
    .then(message => {
      logger.info('Sent message to:', to, 'Msg:', msg);
    })
    .catch(error => {
      logger.error('Message send failed:', error);
    });
}

function sendOnCallMsg() {
  initClient();
  if (client !== null) {
    const time = new Date().toString();
    const msg = `IoTeX Explorer backend is OFFLINE\n${time}`;
    sendSMS(`+${onCallNumber}`, msg);
  }
}

module.exports = {
  sendOnCallMsg,
};
