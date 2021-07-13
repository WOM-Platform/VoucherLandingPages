const { validate: uuidValidate } = require('uuid');

const express = require('express');
const app = express();

const exphbs = require('express-handlebars');
const hbs = exphbs.create({
    helpers: {
        year: function() { return new Date().getFullYear(); }
    }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.get('/payment/:otc', (req, res) => {
    if(!uuidValidate(req.params.otc)) {
        res.status(400).end();
        return;
    }

    console.log('Payment ' + req.params.otc);

    res.render('payment', {
        otc: req.params.otc
    });
});

app.get('/vouchers/:otc', (req, res) => {
    if(!uuidValidate(req.params.otc)) {
        res.status(400).end();
        return;
    }

    console.log('Vouchers ' + req.params.otc);

    res.render('vouchers', {
        otc: req.params.otc
    });
});

const listener = app.listen(process.env.PORT, function () {
    console.log('Now listening on port ' + listener.address().port);
});
