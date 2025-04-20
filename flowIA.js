const { addKeyword } = require('@bot-whatsapp/bot');
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const flowIA = addKeyword(['*']).addAnswer('🤖 Estoy pensando en la mejor respuesta...', {
    capture: true,
    delay: 700,
}, async (ctx, { flowDynamic }) => {
    const prompt = `
Eres el asistente virtual de Santiago Delgado, asesor autorizado de Claro Costa Rica.
Tienes conocimientos sobre planes de internet por fibra óptica, DTH, cobertura por ubicación y atención profesional al cliente.

Cliente dice: "${ctx.body}"

Responde de forma clara, amable y útil.
    `;

    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });

        const respuesta = completion.data.choices[0].message.content;
        await flowDynamic(respuesta);
    } catch (err) {
        console.error(err);
        await flowDynamic('⚠️ Ocurrió un error con el asistente. Intenta de nuevo más tarde.');
    }
});

module.exports = flowIA;