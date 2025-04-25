const express = require('express')
const app = express();
const nodemailer = require('nodemailer');
const ejs=require('ejs')
const path = require('path');
//rendering views 
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}))

//db
const moongoose = require('mongoose');
const dbUri = "mongodb+srv://root:8466%40tim@timongo.ydcds.mongodb.net/" +
    "?retryWrites=true&w=majority&appName=supermarket";

// //149.82.54.21/32,15.114.158.56
// moongoose.connect(dbUri, { useNewUrlParser: 1true, useUnifiedTopology: true })
//     .then(() => {
//         console.log("Database connected succesfully");
       
//     }).catch((err) => {
//         console.log(err);
//     });

    app.listen(8080);


app.get('/', (req, res) => {
    res.render('index');
});

app.get('/josephcuma', (req, res) => {
    res.render('cuma');
});






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
        // Send email to admin
        await transporter.sendMail({
            from: '"PiCASF Contact Form" <admin@picasf.com>',
            to: 'admin@picasf.com',
            subject: `New Customer Inquiry from ${subject}`,
            text: `You received a new inquiry:\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`,
        });

        console.log('Email sent to admin successfully.');

        // Use EJS to render HTML email content
        const emailHtml = await ejs.renderFile(path.join(__dirname, 'views/email-template.ejs'), { name, message });

        // Send feedback email to customer
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
        console.error(error.stack);
        res.status(500).json({
            success: false,
            message: 'Failed to send emails. Please try again later.',
            error: error.message,
        });
    }
});






app.get('/cookie-policy',(req, res) => {
    res.render('cookie-policy');
})


app.post('/momocallback', (req, res) => {
    const { status, depositId, created, rejectionReason } = req.body;

    let responseMessage = '';

    switch (status) {
        case 'ACCEPTED':
            responseMessage = 'You have paid successfully. Thank you!';
            break;
        case 'REJECTED':
            responseMessage = `Your payment was rejected. Reason: ${rejectionReason || 'Unknown reason'}. Please ensure you have enough balance.`;
            break;
        case 'DUPLICATE_IGNORED':
            responseMessage = 'Please do *182*7*1# and proceed to pay. It\'s still a pending payment. Or restart your order from scratch.';
            break;
        default:
            responseMessage = 'Payment status unknown. Please contact support.';
    }

    // Log the full payload for debugging
    console.log("Callback received:", req.body);

    // Return plain text response
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(responseMessage);
});


app.use((req, res) => {

    res.send('Not found')

});
