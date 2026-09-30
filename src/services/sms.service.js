const { Vonage } = require("@vonage/server-sdk");
const { Channels } = require("@vonage/messages");

// Antes: "new Vonage(...)" se ejecutaba apenas se importaba este archivo.
// Si faltan las env vars (o el SDK valida su formato) en Vercel, esto tira
// la función entera abajo al arrancar (FUNCTION_INVOCATION_FAILED),
// afectando TODOS los endpoints, no solo el de inscripciones.
//
// Ahora el cliente se crea de forma perezosa (lazy) y cacheada: recién se
// instancia la primera vez que se necesita enviar un SMS, dentro de un
// try/catch. Así, si Vonage no está configurado o falla, el resto de la
// app sigue funcionando con normalidad (igual que ya hiciste con Gemini).
let vonageClient = null;

const getVonageClient = () => {
  if (!vonageClient) {
    if (!process.env.VONAGE_API_KEY || !process.env.VONAGE_API_SECRET) {
      throw new Error("Vonage no está configurado (faltan VONAGE_API_KEY / VONAGE_API_SECRET).");
    }
    vonageClient = new Vonage({
      apiKey: process.env.VONAGE_API_KEY,
      apiSecret: process.env.VONAGE_API_SECRET,
    });
  }
  return vonageClient;
};

const sendSMS = async (telefono, texto) => {
  try {
    const vonage = getVonageClient();
    const { messageUUID } = await vonage.messages.send({
      messageType: "text",
      channel: Channels.SMS,
      text: texto,
      to: telefono,
      from: "VonageApis",
    });
    console.log("SMS enviado:", messageUUID);
    return messageUUID;
  } catch (error) {
    // No relanzamos: el envío de SMS es "best effort" y nunca debe romper
    // el flujo principal (crear la inscripción ya se hizo antes de llamar esto).
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