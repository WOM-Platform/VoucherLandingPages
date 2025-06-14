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
        component: (str) => encodeURIComponent(str),
    }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(function (req, res, next) {
    res.locals.res = res;
    next();
});

app.use(express.static('public'));

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
        password: req.params.password,
        womProtocol: process.env.WOM_PROTOCOL ?? 'wom',
    });
});

app.get('/challenge/v1/:challengeId', (req, res) => {
    if(!req.params.challengeId) {
        res.status(400).end();
        return;
    }

    console.log('Badge challenge ID ' + req.params.challengeId);

    res.render('badge-challenge', {
        challengeId: req.params.challengeId,
        womProtocol: process.env.WOM_PROTOCOL ?? 'wom',
    });
});

app.get('/pos/verify', (req, res) => {
    if(!req.query.email || !req.query.token) {
        res.status(400).end();
        return;
    }

    console.log('Verification for email ' + req.query.email);

    res.render('pos-mail-verification', {
        email: req.query.email,
        token: req.query.token,
        womProtocol: process.env.WOM_POS_PROTOCOL ?? 'wompos',
        layout: "pos",
    });
});

/* Count Me In */

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

/* Register well known static files */

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

/* Start it up */

const listener = app.listen(process.env.PORT, function () {
    console.log('Now listening on port ' + listener.address().port);
});
