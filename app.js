const http = require('http');
const express = require('express');
const app = express();

// niezbędny body-parser i urlencoder
const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'ejs'); //podłaczenie generatora szablonów

// tablica z JSON z książkami i ich autorami
var data = [];

app.get('/', function(req, res) {
    res.render('index.ejs',{ message: data }); //przesłanie wiadomości
});

// dodawanie ksiażki do listy
app.post('/msg', urlencodedParser, function(req, res) {
            // console.log("Message from client side:" + req.body.frontmessage);
            let newBook = {
                title: req.body.titlemessage,
                author: req.body.authormessage
            };
            data.push(newBook);
            res.render('index.ejs', { message: data }); //przesłanie wiadomości
        });

//usuwanie książki
app.post('/del', urlencodedParser, function (req, res) {
    console.log("Usunięto: " + req.body.deletemessage);
    data = data.filter(item => item.title !== req.body.deletemessage);
    res.render('index.ejs', { message: data });
})

const server = http.createServer(app);
const port = 8000;

server.listen(port);
console.debug('Port: ' + port);

