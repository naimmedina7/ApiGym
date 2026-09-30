const axios = require("axios");

// Antes usábamos @vonage/server-sdk + @vonage/messages, que internamente
// requieren @vonage/jwt -> uuid. La versión instalada de "uuid" se distribuye
// como ESM puro, y Node no puede cargarla con require(), así que el simple
// hecho de importar el SDK tiraba abajo toda la función serverless en Vercel
// (crash al arrancar, antes de procesar cualquier request).
//
// Solución: usar la API REST clásica de SMS de Vonage directo con axios
// (misma librería que ya usás en gemini.service.js). Esta API no usa JWT
// ni depende de "uuid", solo api_key/api_secret como parámetros.
const SMS_ENDPOINT = "https://rest.nexmo.com/sms/json";

const sendSMS = async (telefono, texto) => {
  try {
    const response = await axios.post(
      SMS_ENDPOINT,
      new URLSearchParams({
        api_key: process.env.VONAGE_API_KEY,
        api_secret: process.env.VONAGE_API_SECRET,
        to: telefono,
        from: "VonageApis",
        text: texto,
      }),
    );

    const result = response.data?.messages?.[0];
    if (result?.status !== "0") {
      // status !== "0" significa que Vonage rechazó el envío
      // (ej: número no verificado en cuenta trial, saldo insuficiente, etc.)
      throw new Error(result?.["error-text"] || "Vonage rechazó el envío del SMS");
    }

    console.log("SMS enviado, message-id:", result.messageId);
    return result.messageId;
  } catch (error) {
    // Best effort: el envío de SMS nunca debe romper el flujo principal
    // (la inscripción ya se creó antes de llamar a esta función).
    console.error("No se pudo enviar el SMS:", error.message);
    return null;
  }
};

module.exports = sendSMS;

// const { Vonage } = require('@vonage/server-sdk');
// const { Channels } = require('@vonage/messages');

// const vonage = new Vonage(
//  {
//  apiKey: process.env.VONAGE_API_KEY,
//  apiSecret: process.env.VONAGE_API_SECRET,
//  }
// );

// const sendSMS = async (telefono, texto) => {
//     const response = await vonage.messages.send({
//       messageType: 'text',
//       channel: Channels.SMS,
//       text: texto,
//       to: telefono,
//       from: 'VonageApis',
//     })
//  .then(({ messageUUID }) => console.log(messageUUID))
//  .catch((error) => console.error(error));
// }

// module.exports = sendSMS;