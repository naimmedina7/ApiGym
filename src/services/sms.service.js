const { Vonage } = require('@vonage/server-sdk');
const { Channels } = require('@vonage/messages');

const vonage = new Vonage(
 {
 apiKey: process.env.VONAGE_API_KEY,
 apiSecret: process.env.VONAGE_API_SECRET,
 }
);

const sendSMS = async (telefono, texto) => {
    const response = await vonage.messages.send({
      messageType: 'text',
      channel: Channels.SMS,
      text: texto,
      to: telefono,
      from: 'VonageApis',
    })
 .then(({ messageUUID }) => console.log(messageUUID))
 .catch((error) => console.error(error));
}

module.exports = sendSMS;