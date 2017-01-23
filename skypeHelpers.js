var moment = require('moment');
var locale_es = require('./moment-es.js');
moment.locale('es', locale_es);


var responseCards = function responseCards(jsonData) {
    if (jsonData !== undefined) {
        if (jsonData.items !== undefined) {
            var jsonResponse = {};
            jsonResponse.type = "message/card";
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
                        card.content.subtitle = "";
                        for(p=0;p<oc.segments.length;p++) {
                            if (p == 0) {
                                card.content.title += oc.segments[p].from + " - " + oc.segments[p].to;
                                card.content.subtitle += moment(oc.segments[p].departure_datetime).format("L");
                                //card.content.subtitle += moment().format("LLLL");
                            } else {
                                card.content.title += " - " + oc.segments[p].to;
                            }
                        }
                        card.content.title += " | ";
                        for(p=0;p<ic.segments.length;p++) {
                            if (p == 0) {
                                card.content.title += ic.segments[p].from + " - " + ic.segments[p].to;
                            } else if (p < ic.segments.length -1) {
                                card.content.title += " - " + ic.segments[p].to;
                            } else {
                                card.content.title += " - " + ic.segments[p].to;
                                card.content.subtitle += " | " + moment(ic.segments[p].arrival_datetime).format("L");   
                            }
                        }
                        card.content.text ="";
                        card.content.images=[]
                        card.content.buttons=[]
                        card.content.tap=null
                        jsonResponse.attachments.push(card);
                    }
                    
                
                }
                
            }
            return jsonResponse;

        } else {
            console.log(jsonData);
            return "NO TIENE EL ROOT ITEMS";
        }
    } else {
        return "NO ESTA DEFINIDO EL JSON";
    }

}

module.exports = {
    'responseCards' : responseCards
}