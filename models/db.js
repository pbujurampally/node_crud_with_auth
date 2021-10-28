const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://pradeepchandra007:OF3tsM37A9yEGsGQ@cluster0.o64wi.mongodb.net/DB?retryWrites=true&w=majority', { useNewUrlParser: true }, (err) => {
    if (!err) { console.log('MongoDB Connection Succeeded.') }
    else { console.log('Error in DB connection : ' + err) }
});

require('./employee.model');

