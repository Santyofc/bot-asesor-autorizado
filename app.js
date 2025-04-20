const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');
const nodemailer = require('nodemailer');
require('dotenv').config();

// ✉️ Configuración del correo para notificación
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// 📞 Flow para contacto en vivo
const flowContactoEnVivo = addKeyword(['contacto', 'hablar', 'llamada']).addAnswer(
    [
        '📞 ¿Quieres hablar directamente con Santiago Delgado?',
        '¡Con gusto! Estoy revisando tu solicitud...',
    ],
    null,
    async (ctx, { flowDynamic }) => {
        const mensaje = `🔔 Nueva solicitud de contacto en vivo.\n\n📱 Número: ${ctx.from}\n💬 Mensaje: ${ctx.body}`;
        
        // 1. Enviar WhatsApp a tu número personal
        await flowDynamic('✅ Te contactaré pronto. ¡Gracias por tu interés!');
        
        // 2. Enviar correo a tu email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.NOTIFY_EMAIL,
            subject: '📬 Nueva solicitud de contacto desde el bot de WhatsApp',
            text: mensaje,
        });

        console.log(`🔔 Notificación enviada a José Santiago para contacto en vivo.`);
    }
);

// 🔁 Flow para preguntar por ayuda
const flowAyuda = addKeyword(['ayuda', 'soporte']).addAnswer([
    '🤖 ¿Con qué necesitas ayuda hoy?',
    'Puedes escribir *Paquetes*, *Cobertura*, *Documentos*, *Contacto*, etc.',
]);

// 🔁 Flow principal de interacción
const flowPrincipal = addKeyword(['hola', 'ole', 'alo']).addAnswer(
    [
        '🙌 ¡Hola! Soy el asistente virtual de *Santiago Delgado*, asesor autorizado de Claro.',
        'Estoy aquí para ayudarte con cobertura, precios de planes, solicitudes y más.',
        '',
        '🖼️ Firma digital:',
        'https://www.asesorclaro-pz.com/img/firma.png',
        '',
        '📞 WhatsApp: +506 6058 1663',
        '📩 Correo: santiago-delgado@asesorclaro-pz.com',
        '🌐 Web: https://www.asesorclaro-pz.com',
        '',
        'Escribe alguna de estas palabras clave para empezar:',
        '👉 *Paquetes* – Ver los precios de los planes Claro (Fibra y DTH)',
        '👉 *Documentos* – Ver archivos oficiales',
        '👉 *Cobertura* – Verificar si hay servicio en tu zona',
        '👉 *Salir* – Para salir del bot',
    ],
    null,
    null,
    [flowContactoEnVivo, flowAyuda]
);

// 📝 Crear el bot y los flujos
const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flowPrincipal]);
    const adapterProvider = createProvider(BaileysProvider);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    QRPortalWeb();
};

main();
