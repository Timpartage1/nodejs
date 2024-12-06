const express = require('express')
const app = express();
const nodemailer = require('nodemailer');

//rendering views 
app.set('view engine', 'ejs');
app.use(express.static('public'));

//db
const moongoose = require('mongoose');
const dbUri = "mongodb+srv://root:8466%40tim@timongo.ydcds.mongodb.net/" +
    "?retryWrites=true&w=majority&appName=supermarket";

//149.82.54.21/32,15.114.158.56
moongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Database connected succesfully");
       
    }).catch((err) => {
        console.log(err);
    });

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
    const { name, email, message } = customerDetails;

    try {
        // Send email to admin@picasf.com
        await transporter.sendMail({
            from: '"PiCASF Contact Form" <admin@picasf.com>', // Sender address
            to: 'admin@picasf.com', // Admin email
            subject: `New Customer Inquiry from ${name}`, // Email subject
            text: `You received a new inquiry:\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`, // Email body (text)
        });

        console.log('Email sent to admin successfully.');

        // Send feedback email to the customer
        await transporter.sendMail({
            from: '"PiCASF Support" <admin@picasf.com>', // Sender address
            to: email, // Customer's email
            subject: 'We Received Your Inquiry!', // Email subject
            text: `Hi ${name},\n\nThank you for reaching out! We have received your message and will respond soon.\n\nYour Message:\n"${message}"\n\nBest regards,\nPiCASF Team`, // Email body (text)
        });

        console.log('Feedback email sent to the customer successfully.');
    } catch (error) {
        console.error('Error sending emails:', error);
    }
}

// Example usage
const customerDetails = {
    name: "timothee".,
    email: 'timothee.kamate@support.carahsoft.com',
    message: 'I am interested in your services. Please contact me.',
};

// Execute the email sending function
sendEmail(customerDetails);

})






app.use((req, res) => {

    res.send('Not found')

});
