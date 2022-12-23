const Messenger = require('../src/messenger/messenger');

const dotenv = require('dotenv')
dotenv.config()
const env = process.env;

const signal = new Messenger(env.SIGNAL_PHONE_ID, env.SIGNAL_API_KEY, env.WHATSAPP_PHONE_ID, env.WHATSAPP_API_KEY);

signal.sendSignal("Ich bin ein Gott")
signal.sendWhatsapp("hey")