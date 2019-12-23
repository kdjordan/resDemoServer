const mongodb = require('mongodb');
const dotenv = require('dotenv').config();

// let port = process.env.PORT || 8080;

// if(port == null || port == "") {
//     port = 3001
// }

mongodb.connect(process.env.CONNECTIONSTRING, {useUnifiedTopology: true, useNewUrlParser: true}, function(err, client) {
    module.exports = client;
    const app = require('./app');
    app.listen(port);
});