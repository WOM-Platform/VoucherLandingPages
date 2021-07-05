const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/payment/:otc', (req, res) => {
    res.send('Payment OTC ' + req.params.otc);
});

app.get('/vouchers/:otc', (req, res) => {
    res.send('Vouchers OTC ' + req.params.otc);
});

const listener = app.listen(process.env.PORT, function () {
    console.log('Now listening on port ' + listener.address().port);
});
