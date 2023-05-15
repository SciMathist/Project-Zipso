const express = require('express');

const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('Hello. I am alive!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function keepAlive() {
  setInterval(() => {
    axios.get(`http://localhost:${PORT}`).then((response) => {
      console.log(`Pinged http://localhost:${PORT} at ${new Date().toLocaleString()}`);
    }).catch((error) => {
      console.error(error);
    });
  }, 5 * 60 * 1000); // ping the app every 5 minutes
  module.exports = keepAlive;
}

keepAlive();
