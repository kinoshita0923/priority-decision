const express = require('express');
const formData = require("express-form-data");
const cookieParser = require('cookie-parser');
const path = require('path');
const domain = require('express-domain-middleware');

const app = express();
const port = process.env.PORT || 3001;
const user = require('./routes/user');
const task = require('./routes/task');
const genre = require('./routes/genre');

app.use(formData.parse({autoClean:true}));
app.use(cookieParser());
app.use(domain);
app.use('/api/user/', user);
app.use('/api/task/', task);
app.use('/api/genre/', genre);
app.use(express.static(path.join(__dirname, '../frontend/build/')));

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "frontend/build", "index.html"));
});

app.listen(port, () => {
  console.log(`listening on *:${port}`);
});