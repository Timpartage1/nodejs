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


app.post('/contact', async (req, res) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 465,
        secure: true,
        auth: {
            user: 'admin@picasf.com',
            pass: '8466@timAmen',
        },
    });

    const { name, email, subject, message } = req.body;

    try {
        // Render EJS template to HTML
        const emailContent = await ejs.renderFile(
            path.join(__dirname, 'views', 'email-template.ejs'),
            { name, message }
        );

        // Send email to admin
        await transporter.sendMail({
            from: '"PiCASF Contact Form" <admin@picasf.com>',
            to: 'admin@picasf.com',
            subject: `New Inquiry from ${subject}`,
            text: `You received a new inquiry:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
        });

        // Send email to the customer
        await transporter.sendMail({
            from: '"PiCASF" <admin@picasf.com>',
            to: email,
            subject: 'We Received Your Inquiry!',
            html: emailContent,
        });

        res.status(200).json({ success: true, message: 'Emails sent successfully!' });
    } catch (error) {
        console.error('Error sending emails:', error);
        res.status(500).json({ success: false, message: 'Failed to send emails. Please try again later.' });
    }
});

app.get('/cookie-policy',(req, res) => {
    res.render('cookie-policy');
})

app.use((req, res) => {

    res.send('Not found')

});
