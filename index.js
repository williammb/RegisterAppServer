const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session');


const app = express()
mongoose.Promise = Promise

app.use(session({
    secret: 'ksdjbhfokdbspjgfob9upweq890324h0943205p94holfn4',
    resave: true,
    saveUninitialized: true,
    useNewUrlParser: true
}))

mongoose.connect('mongodb://localhost:27017/angulardb').then((err) => console.log('Mongoose up'))

const User = require('./models/users')

app.use(bodyParser.json());

app.post('/api/login', async(req, res) => {
    const { email, password } = req.body

    const resp = await User.findOne({ email, password });

    if (!resp) {
        res.json({
            success: false,
            message: 'Incorrect details'
        });
    } else {
        res.json({
            success: true
        });
        req.session.user = email
        req.session.save()
    }
})

app.post('/api/quote', async(req, res) => {
    const user = await User.findOne({ email: req.session.user });
    if (!user) {
        res.json({
            success: false,
            message: 'Invaled user!'
        })
        return
    }

    await User.update({ email: req.session.user }, { $set: { quote: req.body.value } })

    res.json({
        success: true
    });
})


app.post('/api/register', async(req, res) => {
    const { email, password } = req.body

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        res.json({
            success: false,
            messege: "Email already in use"
        });
        return
    }

    const user = new User({ email, password });

    const result = await user.save();

    res.json({
        success: true,
        message: "Welcome!"
    });
    req.session.user = email
    req.session.save()
})

app.get('/api/isloggedin', (req, res) => {
    res.json({
        status: !!req.session.user
    });
})

app.get('/api/data', async(req, res) => {

    const user = await User.findOne({ email: req.session.user });

    if (!user) {
        res.json({
            status: false,
            message: 'User was deleted'
        })
        return
    }

    res.json({
        status: true,
        email: req.session.user,
        quote: user.quote
    });
})

app.get('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({
        success: true
    });
})


app.listen(1234, () => {
    console.log(`Server listening at 1234`);
});