'use strict';

var Alexa = require('alexa-sdk');
var APP_ID = 'amzn1.ask.skill.a515126b-21f6-4bd0-88a8-1375e2005c47';
var translations = require('./translations');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.resources = defaultStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.attributes['speechOutput'] = this.t("WELCOME_MESSAGE", this.t("SKILL_NAME"));

        this.attributes['repromptSpeech'] = this.t("WELCOME_REPROMPT");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
    },

    'GetSlangIntent': function () {
        var itemSlot = this.event.request.intent.slots.Slang;
        var itemName;
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
        }

        var cardTitle = this.t("DISPLAY_CARD_TITLE", this.t("SKILL_NAME"), itemName);
        var translation = translations[itemName];

        if (translation) {
            this.attributes['speechOutput'] = translation;
            this.attributes['repromtSpeech'] = this.t("SLANG_REPEAT_MESSAGE");
            this.emit(':tellWithCard', translation, this.attributes['repromptSpeech'], cardTitle, translation);
        } else {
            var speechOutput = this.t("SLANG_NOT_FOUND_MESSAGE");
            var repromptSpeech = this.t("SLANG_NOT_FOUND_REPROMPT");
            if (itemName) {
                speechOutput += this.t("SLANG_NOT_FOUND_WITH_ITEM_NAME", itemName);
            } else {
                speechOutput += this.t("SLANG_NOT_FOUND_WITHOUT_ITEM_NAME");
            }

            speechOutput += repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }
    },

    'AMAZON.HelpIntent': function () {
        this.attributes['speechOutput'] = this.t("HELP_MESSAGE");
        this.attributes['repromptOutput'] = this.t("HELP_REPROMPT");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
    },

    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },

    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },

    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },

    'SessionEndedRequest':function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    },

    'Unhandled': function () {
        this.attributes['speechOutput'] = this.t("HELP_MESSAGE");
        this.attributes['repromptSpeech'] = this.t("HELP_REPROMPT");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    }
};

var defaultStrings = {
    "en" : {
        "translation": {
            "SKILL_NAME": "Cockney Rhyming Slang",
            "WELCOME_MESSAGE": "Alright me old mucker. Welcome to %s, ask me about any cockney rhyming slang and I will give you the english" +
                               " translation and the context in which it can be used.",
            "WELCOME_REPROMPT": "Don't be shy, spit it out son.",
            "DISPLAY_CARD_TITLE": "%s for %s.",
            "HELP_MESSAGE": "Ask me any word associated with Cockney Rhyming Slang and I will translate it into the queens english" +
                            " and even provide you with the context in which it can be used.",
            "HELP_REPROMPT": "You can say something like what does dog and bone mean?",
            "STOP_MESSAGE": "Goodbye mate. You are now an honorary cockney. Up the hammers!!",
            "SLANG_REPEAT_MESSAGE": "Try saying repeat.",
            "SLANG_NOT_FOUND_MESSAGE": "Sorry mate that I don't know that lingo. ",
            "SLANG_NOT_FOUND_WITH_ITEM_NAME": " %s isn't familiar to me.",
            "SLANG_NOT_FOUND_WITHOUT_ITEM_NAME": " it isn't familiar to me.",
            "SLANG_NOT_FOUND_REPROMPT": " Go on ask me something else fella."
        }
    }
};