const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 80;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/', (req, res) => {
  res.send("This is the api root page");
});

app.listen(port, () => console.log(`Listening on port ${port}`));
