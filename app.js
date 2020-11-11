const express = require('express');
const app = express();
const path = require('path');
const routes = require('./routes/');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../views/js')));

app.use(routes);



app.listen(3000, () => {
    console.log('listening on port 3000')
})