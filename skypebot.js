'use strict';
const apiai = require('apiai');
const uuid = require('node-uuid');
const botbuilder = require('botbuilder');
const skypeHelper = require("./skypeHelpers.js");
module.exports = class SkypeBot {

    get apiaiService() {
        return this._apiaiService;
    }

    set apiaiService(value) {
        this._apiaiService = value;
    }

    get botConfig() {
        return this._botConfig;
    }

    set botConfig(value) {
        this._botConfig = value;
    }

    get botService() {
        return this._botService;
    }

    set botService(value) {
        this._botService = value;
    }

    get sessionIds() {
        return this._sessionIds;
    }

    set sessionIds(value) {
        this._sessionIds = value;
    }

    constructor(botConfig) {
        this._botConfig = botConfig;
        /*var apiaiOptions = {
            language: botConfig.apiaiLang,
            requestSource: "skype"
        };*/

        //this._apiaiService = apiai(botConfig.apiaiAccessToken, apiaiOptions);
        this._sessionIds = new Map();

        this.botService = new botbuilder.ChatConnector({
            appId: this.botConfig.skypeAppId,
            appPassword: this.botConfig.skypeAppSecret
        });

        this._bot = new botbuilder.UniversalBot(this.botService);

        this._bot.dialog('/', (session) => {
            console.log(session);
            if (session.message && session.message.text) {
                this.processMessage(session);
            }
        });

    }

    processMessage(session) {

        let messageText = session.message.text;
        let sender = session.message.address.conversation.id;



        session.send("Hola");
        /*
        if (messageText && sender) {

            console.log(sender, messageText);

            if (!this._sessionIds.has(sender)) {
                this._sessionIds.set(sender, uuid.v1());
            }

            
            let apiaiRequest = this._apiaiService.textRequest(messageText,
                {
                    sessionId: this._sessionIds.get(sender),
                    originalRequest: {
                        data: session.message,
                        source: "skype"
                    }
                });

            apiaiRequest.on('response', (response) => {
                console.log(response);
                if (this._botConfig.devConfig) {
                    console.log(sender, "Received api.ai response");
                }

                if (SkypeBot.isDefined(response.result)) {
                    var responseText = response.result.fulfillment.speech;

                    if (SkypeBot.isDefined(responseText)) {
                        console.log(sender, 'Response as text message');
                        //session.send(responseText);
                        console.log(response.result.fulfillment.source);
                        if (response.result.fulfillment.source == "Resultados") {
                            try {
                                var data = JSON.parse(JSON.parse(response.result.fulfillment.data.search));
                                console.log(data);
                                console.log("cards" ,skypeHelper.responseCards(data));
                                session.send(skypeHelper.responseCards(data)); 
                            } catch (e) {
                                console.log(e);
                                session.send(e);
                            }
                        } else {
                            session.send(responseText);
                        }

                    } else {
                        console.log(sender, 'Received empty speech');
                    }
                } else {
                    console.log(sender, 'Received empty result');
                }
            });

            apiaiRequest.on('error', (error) => {
                console.error(sender, 'Error while call to api.ai', error);
            });

            apiaiRequest.end();
        } else {
            console.log('Empty message');
        }*/

    }

        static isDefined(obj) {
            if (typeof obj == 'undefined') {
                return false;
            }

            if (!obj) {
                return false;
            }

            return obj != null;
        }
}


function responseCards(jsonData) {
    if (isDefined(jsonData)) {
        if (isDefined(jsonData.items)) {
            var jsonResponse = {};
            jsonResponse.type = "message";
            jsonResponse.attachments = []
            var items = jsonData.items;
            var i = 0;
            for (i=0;i<items.length;i++) {
                //para cada outbound choice armar el par con todos los inboud choices de ese item.
                var j = 0;
                for(j=0;j<items[i].outbound_choices.length;j++) {
                    var k = 0;
                    for(k=0;k<items[i].inbound_choices.length;k++) {
                        var oc = items[i].outbound_choices[j];
                        var ic = items[i].inbound_choices[k];
                        var card = {}
                        card.contentType = "application/vnd.microsoft.card.hero";
                        card.content = {}
                        var p = 0;
                        card.content.title = "";
                        for(p=0;p<oc.segments.length;p++) {
                            if (p == 0) {
                                card.content.title += oc.segments[p].from + " - " + oc.segments[p].to;
                            } else {
                                card.content.title += " - " + oc.segments[p].to;
                            }
                        }

                        
                    }
                    
                
                }
                
            }

        } else {
            return "NO TIENE EL ROOT ITEMS";
        }
    } else {
        return "NO ESTA DEFINIDO EL JSON";
    }

}