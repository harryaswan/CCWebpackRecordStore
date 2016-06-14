var Record = require('./record_store/record.js');

var records = [];

records.push(new Record('Elbow', 'Seldom Seen Kid', 9.99, 11111111));
records.push(new Record('Train', 'Bulletproof Picasso', 3.99, 22222222));
records.push(new Record('AC/DC', 'Black Ice', 4.05, 33333333));
records.push(new Record('Vandaveer', 'Oh, Willie, Please...', 3, 44444444));


module.exports = records;
