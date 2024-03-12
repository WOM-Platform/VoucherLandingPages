const { validate: uuidValidate } = require('uuid');

const express = require('express');
const app = express();

const path = require('path');
const { I18n } = require('i18n');
const i18n = new I18n({
    locales: ['en', 'it'],
    fallbacks: {
        'en-*': 'en',
        'it-*': 'it',
    },
    directory: path.join(__dirname, 'locales'),
    defaultLocale: 'en',
});
app.use(i18n.init);

const exphbs = require('express-handlebars');
const hbs = exphbs.create({
    helpers: {
        year: function () { return new Date().getFullYear(); },
        i18n: function (str) {
            if (!str) return str;
            return this.res.__(str);
        },
    }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(function (req, res, next) {
    res.locals.res = res;
    next();
});

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.location('https://wom.social').sendStatus(301);
});

app.get('/payment/:otc', (req, res) => {
    if (!uuidValidate(req.params.otc)) {
        res.status(400).end();
        return;
    }

    console.log('Payment ' + req.params.otc);

    res.render('payment', {
        otc: req.params.otc,
        womProtocol: process.env.WOM_PROTOCOL ?? 'wom'
    });
});

app.get('/vouchers/:otc', (req, res) => {
    if (!uuidValidate(req.params.otc)) {
        res.status(400).end();
        return;
    }

    console.log('Vouchers ' + req.params.otc);

    res.render('vouchers', {
        otc: req.params.otc,
        womProtocol: process.env.WOM_PROTOCOL ?? 'wom'
    });
});

app.get('/migration/:otc', (req, res) => {
    if (!uuidValidate(req.params.otc)) {
        res.status(400).end();
        return;
    }

    console.log('Migration ' + req.params.otc);

    res.render('migration', {
        otc: req.params.otc,
        womProtocol: process.env.WOM_PROTOCOL ?? 'wom'
    });
});

app.get('/migration/:otc/:password', (req, res) => {
    if (!uuidValidate(req.params.otc)) {
        res.status(400).end();
        return;
    }

    console.log('Migration ' + req.params.otc + ' with partial password');

    res.render('migration', {
        otc: req.params.otc,
        womProtocol: process.env.WOM_PROTOCOL ?? 'wom',
        password: req.params.password,
    });
});

function getLayoutForProvider(provider) {
    switch(provider) {
        case 'lHWStaR4SYbuRBXhapAo':
            return "main-provider-pesaro2024";

        default:
            return "main";
    }
}

app.get('/cmi/:providerId/:totemId', (req, res) => {
    console.log('Count Me In scan with totem ID only');

    res.render('countmein', {
        layout: getLayoutForProvider(req.params.providerId),
    });
});
app.get('/cmi/:providerId/:eventId/:totemId', (req, res) => {
    console.log('Count Me In scan with event and totem IDs');

    res.render('countmein', {
        layout: getLayoutForProvider(req.params.providerId),
    });
});
app.get('/cmi/:providerId/:eventId/:totemId/:requestId', (req, res) => {
    console.log('Count Me In scan with event, totem, and request IDs');

    res.render('countmein', {
        layout: getLayoutForProvider(req.params.providerId),
    });
});

function funcAppleAppSiteAssociation(req, res) {
    res
        .type('application/json')
        .render('apple-app-site-association', { layout: false });
};
app.get('/apple-app-site-association', funcAppleAppSiteAssociation);
app.get('/.well-known/apple-app-site-association', funcAppleAppSiteAssociation);

function funcAndroidAssetLinks(req, res) {
    res
        .type('application/json')
        .render('android-asset-links', { layout: false });
};
app.get('/.well-known/assetlinks.json', funcAndroidAssetLinks);

const listener = app.listen(process.env.PORT, function () {
    console.log('Now listening on port ' + listener.address().port);
});
