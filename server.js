require('./models/db');

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyparser = require('body-parser');

const employeeController = require('./controllers/employeeController');

const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');

var jwt = require('express-jwt');
var jsonwebtoken = require('jsonwebtoken');


var app = express();
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());

// app.set('views', path.join(__dirname, '/views/'));
// app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));
// app.set('view engine', 'hbs');

app.listen(3000, () => {
    console.log('Express server started at port : 3000');
});

app.use(jwt({secret:"pradeepchandra007",algorithms: ['HS256']}).unless({path: ['/token','/signup']}));

app.use('/users', employeeController);

app.post('/signup', (req, res) => {
    insertRecord(req, res);
        
});

function insertRecord(req, res) {

    console.log('Inserting : ' + JSON.stringify(req.body));

    var employee = new Employee();
    employee.password = req.body.password;
    employee.email = req.body.email;

    employee.save((err, doc) => {
        if (!err)
            res.send(doc);
        else {
            res.status(400)
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.send(req.body);
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

app.post('/token', (req, res) => {


	Employee.findOne({"email":req.body.email,"password":req.body.password}, (err, doc) => {
        if (!err) {
            if(doc==null){
                res.status(400)
                res.send("Invalid Credentials")
            }else{
            		console.log(doc)
                	jsonwebtoken.sign(req.body,'pradeepchandra007', { algorithm: 'HS256'}, function(err, token) {
				  		console.log(token);
				  		res.send(token)
					});
            }
        }else{
            res.status(400)
            res.send("Invalid Credentials")
        }
    });
    
});


