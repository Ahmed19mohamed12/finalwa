const express = require('express');
const { Client,LocalAuth,MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const app = express();
app.use(express.json());
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const client = new Client({
    
    puppeteer: {

        args: ['--no-sandbox', '--disable-setuid-sandbox']

    },

    authStrategy: new LocalAuth() // Use LocalAuth for session management
});
client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, { small: true });
});
client.on('ready',async () => {
    console.log('Client is ready!');
    await delay(20000);
});
client.initialize();
app.get('/send', async (req, res) => {
    const phone = req.query.phone;
    const message = req.query.message;
    try {
        const response = await client.sendMessage(`${phone}@c.us`,message);
        console.log(`Message sent to ${phone}:`, response);
        res.status(202).send('Sent');
    } catch (err) {
        console.error(`Failed to send message to ${phone}:`, err);
        res.status(404).send('Not Sent');
    }
});
app.get('/sendMedia', async (req, res) => {
    const phone = req.query.phone;
    const message = req.query.message;
    const media = req.query.media;
    const mediainmessage = MessageMedia.fromFilePath(media);
    try {
        const msg = await client.sendMessage(`${phone}@c.us`, mediainmessage,{caption:message});
        res.status(202).send('Sent');
    } catch (error) {
        res.status(404).send({ error: 'Failed to send message' });
    }
});
const PORT = 80;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
