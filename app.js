const express = require('express')
const app = express();
const nodemailer = require('nodemailer');

//rendering views 
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}))

//db
const moongoose = require('mongoose');
const dbUri = "mongodb+srv://root:8466%40tim@timongo.ydcds.mongodb.net/" +
    "?retryWrites=true&w=majority&appName=supermarket";

// //149.82.54.21/32,15.114.158.56
// moongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         console.log("Database connected succesfully");
       
//     }).catch((err) => {
//         console.log(err);
//     });

    app.listen(8080);


app.get('/', (req, res) => {
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
    from: '"PiCASF Support" <admin@picasf.com>', // Sender address
    to: email, // Customer's email
    subject: 'We Received Your Inquiry!', // Email subject
    html: `
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f9;
                        margin: 0;
                        padding: 0;
                        color: #333;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .header img {
                        max-width: 150px;
                    }
                    .content {
                        font-size: 16px;
                        line-height: 1.5;
                    }
                    .footer {
                        margin-top: 20px;
                        text-align: center;
                        font-size: 14px;
                        color: #777;
                    }
                    .footer a {
                        color: #007bff;
                        text-decoration: none;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://picasf.com/picasf.JPG" alt="PiCASF Logo">
                    </div>
                    <div class="content">
                        <p>Hi ${name},</p>
                        <p>Thank you for reaching out!</p><p> We have received your message and will respond soon.</p><br>
                        <p><strong>Your Message:</strong></p>
                        <blockquote style="font-style: italic; color: #555;">"${message}"</blockquote>
                        <p>Best regards,<br><strong>PICASF Team</strong></p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 PiCASF. All rights reserved.</p>
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






app.use((req, res) => {

    res.send('Not found')

});
