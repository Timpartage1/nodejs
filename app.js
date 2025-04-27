const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const axios = require('axios');
const mongoose = require('mongoose'); // typo fixed (was 'moongoose')
const bodyParser = require('body-parser');

// Parse JSON BEFORE routes
app.use(express.json());
app.use(bodyParser.json());

// Setup EJS views
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const dbUri = "mongodb+srv://root:8466%40tim@timongo.ydcds.mongodb.net/?retryWrites=true&w=majority&appName=supermarket";
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });

// Start the server
app.listen(8080, () => {
    console.log('Server running on http://localhost:8080');
});

// Home page
app.get('/', (req, res) => {
    res.render('index');
});

// Other page
app.get('/josephcuma', (req, res) => {
    res.render('cuma');
});

// Contact form
app.post('/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;

    const transporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 465,
        secure: true,
        auth: {
            user: 'admin@picasf.com',
            pass: '8466@timAmen',
        },
    });

    try {
        await transporter.sendMail({
            from: '"PiCASF Contact Form" <admin@picasf.com>',
            to: 'admin@picasf.com',
            subject: `New Customer Inquiry from ${subject}`,
            text: `You received a new inquiry:\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`,
        });

        console.log('Email sent to admin successfully.');

        const emailHtml = await ejs.renderFile(path.join(__dirname, 'views/email-template.ejs'), { name, message });

        await transporter.sendMail({
            from: '"PiCASF" <admin@picasf.com>',
            to: email,
            subject: 'We Received Your Inquiry!',
            html: emailHtml,
        });

        console.log('Feedback email sent to the customer successfully.');
        res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending emails:', error.message);
        res.status(500).json({ success: false, message: 'Failed to send emails.', error: error.message });
    }
});

// Cookie policy page
app.get('/cookie-policy', (req, res) => {
    res.render('cookie-policy');
});

// In-memory storage for payment statuses
const paymentStatuses = {}; // { orderId: { status: 'ACCEPTED' or 'REJECTED', reason: 'xxx' } }

// Pawapay will call this after payment
app.post('/momocallback', async (req, res) => {
    console.log('Callback received:', req.body);
    const { depositId, status, rejectionReason, metadata } = req.body;

    // Extract the orderId from metadata
    const orderIdMeta = metadata.find(m => m.fieldName === 'orderId');
    const orderId = orderIdMeta ? orderIdMeta.fieldValue : null;

    if (!orderId) {
        console.error('Missing orderId in callback');
        return res.status(400).json({ success: false, message: 'Missing orderId in callback' });
    }

    // Handle payment status
    if (status === 'COMPLETED') {
        paymentStatuses[orderId] = { status: 'COMPLETED', depositId, message: 'Payment completed successfully' };

        try {
            // Trigger Arduino when payment accepted
            await axios.get('https://f5ea-2c0f-eb68-674-4800-cc7b-67b5-e6f8-26bd.ngrok-free.app/turn-on');
            console.log('Arduino turned ON for order:', orderId);
        } catch (error) {
            console.error('Failed to trigger Arduino:', error.message);
            paymentStatuses[orderId].message = 'Payment completed, but failed to trigger Arduino';
        }
    } else if (status === 'REJECTED') {
        paymentStatuses[orderId] = { status: 'REJECTED', rejectionReason, message: rejectionReason || 'Payment rejected' };
    } else {
        paymentStatuses[orderId] = { status, message: 'Payment status is not completed or rejected' };
    }

    // Respond to pawaPay callback with the appropriate status
    res.status(200).json({
        success: true,
        status: status,
        message: paymentStatuses[orderId].message
    });

    console.log(`Payment status for order ${orderId}:`, paymentStatuses[orderId]);
});

// Flutter app calls this to check if payment accepted
app.get('/check-payment-status', (req, res) => {
    const orderId = req.query.orderId;
    if (!orderId || !paymentStatuses[orderId]) {
        return res.status(404).json({ success: false, message: 'Order not found or payment not completed yet' });
    }
    res.json({ success: true, orderId, status: paymentStatuses[orderId].status, message: paymentStatuses[orderId].message });
});
