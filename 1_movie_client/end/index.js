const http = require('http');
const API_KEY = '3f6ea404';
const query = 'hacker';
const URI = `http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`

// First approach: HTTP Movie search
http.get(URI, res => {
  let data = '';

  res.on('data', chunk => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(JSON.parse(data));
  });

}).on("error", err => {
  console.log("Error: " + err.message);
});

// Second approach: Axios Movie search

const axios = require('axios');

// function getData (res) {
//   console.log(res.data);
// }

axios.get(URI)
  .then(res => console.log(res.data))
  .catch(error => {
    console.log(error);
  });