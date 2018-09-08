var express = require('express');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var path = require('path');
var nodemailer = require('nodemailer');

const app = express();

//view engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//Static folders
app.use('/public', express.static(path.join(__dirname, 'public')));


//body-parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('contact');
});

//post route for submission
app.post('/send', (req, res) => {
    
    var output = `
        <p>You have a new contact request</p>
        <h3>Contact Details</h3>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Company: ${req.body.company}</li>
            <li>Email: ${req.body.email}</li>
            <li>Phone Number: ${req.body.phone}</li>
        </ul>

        <h3>Message</h3>
        <p>${req.body.message}</p>
    `;

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'mail.ogechike.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'test@ogechike.com', // generated ethereal user
                pass: 'Liveone41!' // generated ethereal password
            },
            tls:{
                rejectUnauthorized:false
              }
        });
    
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Nodemailer Contact" <test@ogechike.com>', // sender address
            to: 'oike279@gmail.com', // list of receivers
            subject: 'New Contact Request', // Subject line
            text: 'Hello world?', // plain text body
            html: output // html body
        };
    
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
        
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
        res.render('contact' , {msg: "Email has been sent"});
        });
    });


app.listen(3000, () => {
    console.log("Server has started...");
});