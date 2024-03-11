const http = require('http');
const express = require('express');
const app = express();

// niezbędny body-parser i urlencoder
const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'ejs'); //podłaczenie generatora szablonów


let data = []; // tablica z JSON z książkami i ich autorami
let idBook = 0; // numeracja książek
let bookToEdit = []; // tablica z książką do edycji

app.get('/', function(req, res) {
    res.render('index.ejs',{ message: data }); //przesłanie wiadomości
});


// DODAWANIE KSIĄŻKI DO LISTY
app.post('/msg', urlencodedParser, function(req, res) {
            // console.log("Message from client side:" + req.body.frontmessage);
            let newBook = {
                title: req.body.titlemessage,
                author: req.body.authormessage,
                id: idBook
            };

            // dodanie ksiąki do tablicy książek
            data.push(newBook);

            //inkrementacja numeru książki
            idBook++;
            res.render('index.ejs', { message: data }); //przesłanie wiadomości
        });

// USUWANIE KSIĄŻKI
app.post('/del', urlencodedParser, function (req, res) {
    console.log("Usunięto: " + req.body.deletemessage);
    data = data.filter(item => item.title !== req.body.deletemessage);
    res.render('index.ejs', { message: data });
})

//ERDYCJA KSIĄZKI
app.post('/edit', urlencodedParser, function (req, res) {
    // przypisanie value z tej książki
    const bookId = req.body.id;

    // znalezienie ksiązki po id równym value (bookId)
    bookToEdit = data.find(book => book.id === parseInt(bookId));
    if (!bookToEdit) {
        // obsługa błędu
        return res.status(404).send("Książka do edycji nie została znaleziona.");
    }
    res.render('edit.ejs', { edit: bookToEdit });
})


// POWRÓT NA STRONĘ GŁÓWNĄ
app.post('/edited', urlencodedParser, function (req, res) {
    const editedBookId = req.body.id;
    const editedTitle = req.body.titlemessage;
    const editedAuthor = req.body.authormessage;

    // znajdź indeks książki w tablicy data[]
    const index = data.findIndex(book => book.id === parseInt(editedBookId));

    //sprawdź czy index istnieje
    if (index !== -1) {
        // nowy tytuł i autor książki
        data[index].title = editedTitle;
        data[index].author = editedAuthor;
    } else {
        // obsługa błędu
        return res.status(404).send("Nie udało się edytować książki.");
    }

    res.render('index.ejs', { message: data });
})

const server = http.createServer(app);
const port = 8000;

server.listen(port);
console.debug('Port: ' + port);

