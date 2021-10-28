const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');





router.put('/:id', (req, res) => {
     updateRecord(req, res);
});



function updateRecord(req, res) {

    console.log('Updating : ' + JSON.stringify(req.body));


    Employee.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, doc) => {
        if (!err) { console.log(doc);
            if(doc==null){
                res.status(400)
                res.send("Employee not found")
            }else{
                res.send(doc);
            }
            
        }
        else {
            res.status(400)
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.send(doc)
            }
            else
                res.status(400)
                res.send({"updateError":'Error during record update : ' + err});
        }
    });
}


router.get('/', (req, res) => {
    Employee.find((err, docs) => {
        if (!err) {
            res.send(docs);
        }
        else {
            res.status(400)
            res.send('Error in retrieving employee list :' + err);
        }
    });
});


function handleValidationError(err, body) {
    console.log(err)
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'password':
                body['passwordError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
        delete body.email
        delete body.password
    }
}

router.get('/:id', (req, res) => {
    Employee.findById(req.params.id, (err, doc) => {
        if (!err) {
            if(doc==null){
                res.status(400)
                res.send("Employee not found")
            }else{
                res.send(doc);
            }
        }else{
            res.status(400)
            res.send(err.message)
        }
    });
});

router.delete('/:id', (req, res) => {
    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.send(doc)
        }
        else {
            res.status(400)
            res.send('Failed to delete user')
            console.log('Error in employee delete :' + err); 
        }
    });
});

module.exports = router;