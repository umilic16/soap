"use strict";

const DbService = require("../mixins/analytics-db.mixin");
var request = require("request");
const express = require("express")
const bodyParser = require("body-parser")

module.exports = {
    name: "analytics",
    mixins: [
        DbService("analytics")
    ],
    settings: {
        port: process.env.PORT || 3000
    },
    methods: {
        initRoutes(app){
            app.post("/CEPResponse",this.postData);
        },
        postData(req, res){
            console.log("req: ", req.body);
        }
    },
    events: {
        "analytics.data": {
            group: "other",
            handler(payload) {
                // console.log("analytics.data payload: ", payload);
                request.post({
                    headers: { 'content-type': 'application/json' },
                    url: `http://siddhi:6000/analytics`,
                    body: `{"High":${payload.High},"Low":${payload.Low}}`
                })
            }
        }
    },
    created() {
        const app = express();
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(bodyParser.json());
        app.listen(this.settings.port);
        this.initRoutes(app);
        this.app=app;
    }
}