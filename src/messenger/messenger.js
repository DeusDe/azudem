const axios = require('axios')

class Messenger {
    constructor(SignalPhoneID, SignalApiKey, whatsappPhoneID, whatsappApiKey) {
        this.signalPhoneID = SignalPhoneID;
        this.signalApiKey = SignalApiKey;
        this.whatsappPhoneID = whatsappPhoneID;
        this.whatsappApiKey = whatsappApiKey;
    }

    sendSignal(message) {
        axios.get(`https://api.callmebot.com/signal/send.php?phone=${this.signalPhoneID}&apikey=${this.signalApiKey}&text=${message}`);
    }

    sendWhatsapp(message) {
        axios.get(`https://api.callmebot.com/whatsapp.php?phone=${this.whatsappPhoneID}&apikey=${this.whatsappApiKey}&text=${message}`)
    }


}

module.exports = Messenger