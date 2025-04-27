const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');

// Parse JSON BEFORE routes
app.use(express.json());
app.use(bodyParser.json());


const nodemailer = require('nodemailer');

//rendering views 
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}))

//db
// const moongoose = require('mongoose');
// const dbUri = "mongodb+srv://root:8466%40tim@timongo.ydcds.mongodb.net/" +
//     "?retryWrites=true&w=majority&appName=supermarket";

// //149.82.54.21/32,15.114.158.56
// moongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         console.log("Database connected succesfully");
       
//     }).catch((err) => {
//         console.log(err);
//     });

   


app.get('/', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.render('index');
});

app.post('/contact',(req,res)=>{
    

// Configure Zoho SMTP transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465, // Use 465 for SSL/TLS
    secure: true, // SSL/TLS connection
    auth: {
        user: 'admin@picasf.com', // Your Zoho Mail email address
        pass: '8466@timAmen', // Your Zoho Mail password or App Password
    },
});

// Function to send emails
async function sendEmail(customerDetails) {
    const { name, email, subject, message } = customerDetails;

    try {
        // Send email to admin@picasf.com
        await transporter.sendMail({
            from: '"PiCASF Contact Form" <admin@picasf.com>', // Sender address
            to: 'admin@picasf.com', // Admin email
            subject: `New Customer Inquiry from ${subject}`, // Email subject
            text: `You received a new inquiry:\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`, // Email body (text)
        });

        console.log('Email sent to admin successfully.');

        // Send feedback email to the customer
        // await transporter.sendMail({
        //     from: '"PiCASF Support" <admin@picasf.com>', // Sender address
        //     to: email, // Customer's email
        //     subject: 'We Received Your Inquiry!', // Email subject
        //     text: `Hi ${name},\n\nThank you for reaching out! We have received your message and will respond soon.\n\nYour Message:\n"${message}"\n\nBest regards,\nPiCASF Team`, // Email body (text)
        // });

       // Send feedback email to the customer
await transporter.sendMail({
    from: '"PiCASF" <admin@picasf.com>', // Sender address
    to: email, // Customer's email
    subject: 'We Received Your Inquiry!', // Email subject
    html: `
        <html>
            <head>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background-color: #f4f7fb;
                        margin: 0;
                        padding: 0;
                        color: #4d4d4d;
                    }
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        background-color: #ffffff;
                        padding: 30px;
                        border-radius: 10px;
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    .header img {
                        max-width: 180px;
                        height: auto;
                    }
                    .content {
                        font-size: 16px;
                        line-height: 1.6;
                        margin-bottom: 20px;
                    }
                    .content p {
                        margin-bottom: 15px;
                    }
                    .quote {
                        font-style: italic;
                        color: #555;
                        border-left: 4px solid #007bff;
                        padding-left: 15px;
                        margin: 20px 0;
                    }
                    .footer {
                        margin-top: 40px;
                        text-align: center;
                        font-size: 14px;
                        color: #999;
                    }
                    .footer a {
                        color: #007bff;
                        text-decoration: none;
                    }
                    .footer a:hover {
                        text-decoration: underline;
                    }
                    .cta {
                        display: inline-block;
                        margin-top: 20px;
                        padding: 10px 20px;
                        background-color: #007bff;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: bold;
                    }
                    .cta:hover {
                        background-color: #0056b3;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://picasf.com/images/picasf.JPG" alt="PiCASF Logo">
                    </div>
                    <div class="content">
                        <p>Hi ${name},</p>
                        <p>Thank you for reaching out to PiCASF! We have received your inquiry and will respond as soon as possible.</p>
                        <p><strong>Your Message:</strong></p>
                        <blockquote class="quote">"${message}"</blockquote>
                        <p>We appreciate your patience.</p>
                        <p>Best regards,<br><strong>The PiCASF Team</strong></p>
                        <a href="https://picasf.com" class="cta">Visit Our Website</a>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 PiCASF. All rights reserved.</p>
                        <p>PiCASF, Kigali, Rwanda | <a href="mailto:admin@picasf.com">admin@picasf.com</a></p>
                    </div>
                </div>
            </body>
        </html>`, // Email body (HTML format)
});


        console.log('Feedback email sent to the customer successfully.');
    } catch (error) {
        console.error('Error sending emails:', error);
    }
}

// Example usage
const customerDetails = {
    name: req.body.name,
    email: req.body.email,
    subject: req.body.subject,
    message: req.body.message,
};

// Execute the email sending function
sendEmail(customerDetails);

})



// In-memory storage for payment statuses
const paymentStatuses = {}; // { orderId: { status: 'ACCEPTED' or 'REJECTED', reason: 'xxx' } }

app.get('/momocallback', async (req, res) => {
    console.log('Callback received:', req.body);
    res.header('Access-Control-Allow-Origin', '*');
     ret= res.body;
     await ret;
     return ret;
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
    res.header('Access-Control-Allow-Origin', '*');
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