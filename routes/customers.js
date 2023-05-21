//const customer = require('../models/customer'); // this customer object has two properties-> 1. Customer, validate
//lekin hum ise aese nahi likhege -> hum object destructuring ka use karenge ->
const {Customer, validate} = require('../models/customer'); // ab is object me do properties return ho rahi thi wo Customer, validate me asign ho jaengi. (na samjh me aye to vid 110 ko 5:15 per dekh lena)

const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');

// const customers = [
//     {id: 1, name: 'Janisar', number: "12345"},
//     {id: 2, name: 'Balkishun', number: "56262"},
//     {id: 3, name: 'Ankit', number: "98345"},
// ]





//1. all costomer
router.get('/', async (req, res) => {
    const customers = await Customer.find().sort({ name: 1 });
    res.send(customers);
});

//2. costumer by id
router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if(!customer) {
        res.status(404).send('The customer with given id is not found.');
        return;
    }
    res.send(customer);
});

//3. create or add costumer
router.post('/', auth, async (req, res) => {
    const result = validate(req.body);

    if(result.error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    let customer = new Customer({ name: req.body.name, isGold: req.body.isGold, number: req.body.number });

    customer = await customer.save();
    res.send(customer);
});

//4. Update costumer
router.put('/:id', auth, async (req, res) => {
    const result = validate(req.body);
    if(result.error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    
    const customer = await Customer.findByIdAndUpdate(req.params.id, { name: req.body.name, isGold: req.body.isGold, number: req.body.number }, { new: true });
    
    if(!customer) {
        res.status(404).send('The customer with given id is not found.');
        return;
    }
    
    res.send(customer);
});

//5. delete a costumer
router.delete('/:id', auth, async (req, res) => {

    const customer = await Customer.findByIdAndRemove(req.params.id);

    if(!customer) {
        res.status(404).send('The customer with given id is not found.');
        return;
    }

    res.send(customer);
});

module.exports = router;