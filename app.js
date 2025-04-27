const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');

// Parse JSON BEFORE routes
app.use(express.json());
app.use(bodyParser.json());

// In-memory storage for payment statuses
const paymentStatuses = {}; // { orderId: { status: 'ACCEPTED' or 'REJECTED', reason: 'xxx' } }

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

        // Trigger Arduino asynchronously without blocking the response
        axios.get('https://ab22-2c0f-eb68-674-4800-89c0-c9c8-27a4-2d26.ngrok-free.app/turn-on')
            .then(() => {
                console.log('Arduino turned ON for order:', orderId);
            })
            .catch((error) => {
                console.error('Failed to trigger Arduino:', error.message);
                // Don't block callback response if Arduino fails
            });
    } else if (status === 'REJECTED') {
        paymentStatuses[orderId] = { status: 'REJECTED', rejectionReason, message: rejectionReason || 'Payment rejected' };
    } else {
        paymentStatuses[orderId] = { status, message: 'Payment status is not completed or rejected' };
    }

    // Respond to pawaPay callback immediately with the appropriate status
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

// Start the server
app.listen(8080, () => {
    console.log('Server running on http://localhost:8080');
});