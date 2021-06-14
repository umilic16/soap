"use strict";

const DbService = require("../mixins/analytics-db.mixin");
var request = require("request");
module.exports = {
    name: "analytics",
    mixins: [
        DbService("analytics")
    ],
    actions: {
        ComplexAnalysis: {
            rest: {
                method: "POST",
                path: "/ComplexAnalysis",
            },
            async handler(ctx) {
                var response = ctx.params.event;
                // console.log("Analytics service response from siddhi: ", response);
                this.adapter.insert({ Open: response.open, Result: response.result});
                if(response.flag==1){
                    //salje tu detektovanu nisku cenu
                    this.broker.emit("lowPrice", response.open);
                }
                else{
                    //salje tu visoku cenu
                    this.broker.emit("highPrice", response.open);
                }
            }
        }
    },
    events: {
        "analytics.data": {
            handler(payload) {
                // console.log("Analytics data recieved, sending to siddhi: ", payload.Open);
                request.post({
                    headers: { 'content-type': 'application/json' },
                    url: `http://siddhi:6000/analytics`,
                    body: `{"open":${payload.Open}}`
                })
            }
        }
    },
}