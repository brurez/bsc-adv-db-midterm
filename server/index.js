const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes.js');

const app = express();
const port = process.env.PORT || 8081;

require('./db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/', (req, res) => {
  res.send("This is the api root page");
});

app.use('/api', routes);


app.listen(port, () => console.log(`Listening on port ${port}`));
