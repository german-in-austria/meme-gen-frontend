import * as nodemailer from 'nodemailer'
import * as express from 'express'
import * as fileUpload from 'express-fileupload'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'

console.log(process.env)

const app = express()

// file upload
app.use(fileUpload({
  limits: { fileSize: 25 * 1024 * 1024 }
}))

app.use('/', express.static(__dirname))

app.use(bodyParser.json({
  limit: '15MB'
}))

app.use(cors({
  credentials : true,
  origin: (origin: string, callback: Function) => {
    const originIsWhitelisted = [
      'http://localhost',
      'http://localhost:8080',
      'http://localhost:8000',
      'https://typo3.dioe.at',
      'https://dioe.at',
      'https://iam.dioe.at',
      'https://memes.dioe.at',
      'https://www.dioe.at'
    ].indexOf(origin) !== -1
    callback(null, originIsWhitelisted)
  }
}))


const transporter = nodemailer.createTransport({
  host: "mail.dioe.at",
  port: 587,
  secure: false,
  authMethod: 'LOGIN',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
})

app.post('/sendmail', (req, res) => {
  res.send('sending!')
  transporter.sendMail({
    from: 'lioe@dioe.at',
    to: process.env.SEND_TO.split(','),
    subject: "Message title",
    text: "Plaintext version of the message",
    html: req.body.personal.map((t: any) => {
      return t.name + ': ' + t.value
    }).join('<br>') + '<br><br>',
    attachments: [
      {
        filename: 'meme.png',
        path: req.body.image // base64
      }
    ]
  }).then(console.log)
})

app.listen(3000)
