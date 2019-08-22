const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')


const app = express()
mongoose.Promise = Promise

mongoose.connect('mongodb://localhost:27017/angulardb').then((err) => console.log('Mongoose up'))

const User = require('./models/users')

app.use(bodyParser.json());

app.post('/api/login', async(req, res) => {
    const { email, password } = req.body

    const resp = await User.findOne({ email, password });

    if (!resp) {
        console.log("incorrect details");
        // user login is incorrect
    } else {
        console.log("logging you in");
        // make a session and set user to logged in 
    }
    res.send('k');
})

app.post('/api/register', async(req, res) => {
    const { email, password } = req.body
    const user = new User({ email, password });
    const result = await user.save();
    console.log(result);
    res.json(result);
    //store this data on databese
})

app.listen(1234, () => {
    console.log(`Server listening at 1234`);
});