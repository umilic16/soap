"use strict";

const DbService = require("../mixins/analytics-db.mixin");
var request = require("request");
module.exports = {
    name: "analytics",
    mixins: [
        DbService("analytics")
    ],
    settings: {
    },
    actions: {
        CEPResponse: {
            rest: {
                method: "POST",
                path: "/CEPResponse",
            },
            async handler(ctx) {
                var result = ctx.params.event;
                console.log(result);
                this.adapter.insert({ Open: result.open});
            },
        },
    },
    events: {
        "analytics.data": {
            handler(payload) {
                // console.log(payload);
                request.post({
                    headers: { 'content-type': 'application/json' },
                    url: `http://siddhi:6000/analytics`,
                    body: `{"open":${payload.Open}}`
                })
            }
        }
    },
}