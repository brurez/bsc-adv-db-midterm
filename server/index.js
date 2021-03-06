const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes.js');

const app = express();
const port = process.env.SERVER_PORT || 80;

require('./db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/', (req, res) => {
  res.send("This is the api root page");
});

app.use('/api', routes);

app.use(express.static('build'))


app.listen(port, () => console.log(`Listening on port ${port}`));
