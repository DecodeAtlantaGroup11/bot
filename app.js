// This loads the environment variables from the .env file
require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');
var Store = require('./store');
var spellService = require('./spell-service');
var request = require('request');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
// Create connector and listen for messages
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, function (session) {
    session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
});

// You can provide your own model by specifing the 'LUIS_MODEL_URL' environment variable
// This Url can be obtained by uploading or creating your model from the LUIS portal: https://www.luis.ai/
var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
bot.recognizer(recognizer);

// Querying cosmos to repeat my name
bot.dialog('HelloWorld', function (session, args) {
    session.send('Hi there! Wait a sec while I try repeating your name...');
    var nameEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'Name');
    if (nameEntity) {
        // nameEntity entity detected, continue to next step
        request('https://prod-25.eastus.logic.azure.com/workflows/14d0db12e3e34d1a8f905487b8634f61/triggers/manual/paths/invoke/hello/' + nameEntity.entity + '?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=D-EJcdNi2P5loUwH6W0A6eA-EJvxdlUH6lMFKYTYWO8', function (error, response, body) {
            session.send(JSON.parse(body).result);
        });
    }
}).triggerAction({
    matches: 'HelloWorld'
});

// Querying cosmos to hello world
bot.dialog('TestHelloWorld', function (session) {
    session.send('Hi there! Wait a sec while I try helloing your world...');
    request('https://prod-24.eastus.logic.azure.com/workflows/7ee7b1f417c04c24afa7cb5b24b68d2e/triggers/manual/paths/invoke/hi?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=6_KlmKq1RoFU85VOa-VWwp4hFCQ82yleOXMswvpEglY', function (error, response, body) {
        session.send(JSON.parse(body).result);
    });
}).triggerAction({
    matches: 'TestHelloWorld'
});

// Querying cosmos for app details
bot.dialog('GetAllAppDetails', function (session, args) {
    session.send('Hi there! Wait a sec while I try getting all the details related to the application...');
    var applicationIdEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'ApplicationID');
    if (applicationIdEntity) {
        // applicationIdEntity detected, continue to next step
        request('https://prod-05.eastus.logic.azure.com/workflows/c466364575e9422e92a144244b330e62/triggers/manual/paths/invoke/asset/' + applicationIdEntity.entity + '/details?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Zt7bXnHyoxjpXiikmxlADpIE5ivtDMXJVhLaoKbNHnM', function (error, response, body) {
            session.send(JSON.stringify(JSON.parse(body).result[0]));
        });
    }
}).triggerAction({
    matches: 'GetAllAppDetails'
});

// Querying cosmos for app owner
bot.dialog('GetAppOwner', function (session, args) {
    session.send('Hi there! Wait a sec while I try getting all the owner of the application...');
    var applicationIdEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'ApplicationID');
    if (applicationIdEntity) {
        // applicationIdEntity detected, continue to next step
        request('https://prod-02.eastus.logic.azure.com/workflows/05fbe4c8d2d745bb9fbedc0e28c2df07/triggers/manual/paths/invoke/asset/' + applicationIdEntity.entity + '/owner?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=HYiMXgkgMdjHC58T8PZ5HIbn_3QSiiQnTvkMGN-YDuE', function (error, response, body) {
            session.send(JSON.stringify(JSON.parse(body).result));
        });
    }
}).triggerAction({
    matches: 'GetAppOwner'
});

// Querying cosmos for owning business of the app
bot.dialog('GetBusinessApp', function (session, args) {
    session.send('Hi there! Wait a sec while I try getting all the business that owns the application...');
    var applicationIdEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'ApplicationID');
    if (applicationIdEntity) {
        // applicationIdEntity detected, continue to next step
        request('https://prod-29.eastus.logic.azure.com/workflows/3c24a9df449848f3a2458b20cb699e2d/triggers/manual/paths/invoke/asset/' + applicationIdEntity.entity + '/business?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=vTcm8ue_PVHthPFn0nYhxxaHQQm7rEjkdKTGp2Rq8_g', function (error, response, body) {
            session.send(JSON.stringify(JSON.parse(body).result[0].U_OWNING_BUSINESS));
        });
    }
}).triggerAction({
    matches: 'GetBusinessApp'
});

// Querying cosmos for resources of the app
bot.dialog('GetResourcesApp', function (session, args) {
    session.send('Hi there! Wait a sec while I try getting all the resources of the application...');
    var applicationIdEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'ApplicationID');
    if (applicationIdEntity) {
        // applicationIdEntity detected, continue to next step
        request('https://prod-10.eastus.logic.azure.com/workflows/1ad7ea872584445a90f983b1c5d2c612/triggers/manual/paths/invoke/asset/' + applicationIdEntity.entity + '/resources?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=os84VxxnUxNgXUQ1QTemYfxAhZtxdwDZck1pwua1JfI', function (error, response, body) {
            session.send(JSON.stringify(JSON.parse(body).result));
        });
    }
}).triggerAction({
    matches: 'GetResourcesApp'
});

// Querying cosmos for compatibility to move app to Azure
bot.dialog('GetMigrationCompatibility', function (session, args) {
    session.send('Hi there! Wait a sec while I try finding out if we can move the app to Azure...');
    var applicationIdEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'ApplicationID');
    if (applicationIdEntity) {
        // applicationIdEntity detected, continue to next step
        request('https://prod-16.eastus.logic.azure.com/workflows/7158558af5ad46bda8b32f6d728881df/triggers/manual/paths/invoke/asset/' + applicationIdEntity.entity + '/compatibility?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=1gQTfeRezEfec07oCHspzh-XqVeoqYtZfdMRonUSNLM', function (error, response, body) {
            var ret = JSON.parse(body).result;
            session.send(ret[0].compatible);
        });
    }
}).triggerAction({
    matches: 'GetMigrationCompatibility'
});

// Querying cosmos for savings if move app to Azure
bot.dialog('GetMigrationSavings', function (session, args) {
    session.send('Hi there! Wait a sec while I try finding out how much you can save by moving your app to Azure...');
    var applicationIdEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'ApplicationID');
    if (applicationIdEntity) {
        // applicationIdEntity detected, continue to next step
        request('https://prod-14.eastus.logic.azure.com/workflows/cf6f1e5b349c438ea8772a9bd8ebbd47/triggers/manual/paths/invoke/asset/' + applicationIdEntity.entity + '/savings?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ok_Rg8LJ03FAexLHSrz7ipnL01-wf0QUf9LXctiVtKA', function (error, response, body) {
            var ret = JSON.parse(body).result;
            session.send('$' + JSON.stringify(ret[0].COST));
        });
    }
}).triggerAction({
    matches: 'GetMigrationSavings'
});

bot.dialog('Help', function (session) {
    session.endDialog('Hi! Try asking me things like \'search hotels in Seattle\', \'search hotels near LAX airport\' or \'show me the reviews of The Bot Resort\'');
}).triggerAction({
    matches: 'Help'
});

// Spell Check
if (process.env.IS_SPELL_CORRECTION_ENABLED === 'true') {
    bot.use({
        botbuilder: function (session, next) {
            spellService
                .getCorrectedText(session.message.text)
                .then(function (text) {
                    session.message.text = text;
                    next();
                })
                .catch(function (error) {
                    console.error(error);
                    next();
                });
        }
    });
}