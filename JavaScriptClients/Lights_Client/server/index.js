const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')

var urlencodedParser = bodyParser.urlencoded({ extended: false })

const app = express()

app.use(express.static('public'))

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html')
})

app.get('/end', function (req, res) {
    res.sendFile(__dirname + '/public/end.html')
})

app.post('/credentials', urlencodedParser, function (req, res) {
    ssid = req.body.ssid
    password = req.body.password

    // Write ssid and password to a file
    fs.writeFile("credentials.txt", ssid + "\n" + password, function (err) {
        //console.log(err)
    })
    console.log('File saved!')

    res.redirect('/end')
})

app.listen(3000, () =>
    console.log('Listening on port 3000.')
)