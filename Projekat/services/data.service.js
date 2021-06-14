"use strict";

const express = require("express")
const bodyParser = require("body-parser")
const ObjectId = require("mongodb").ObjectID;
const DbService = require("../mixins/db.mixin")

module.exports = {
    name: "data",
    mixins: [
        DbService("data")
    ],
    settings: {
        port: process.env.PORT || 3000
    },
    actions: {
        getData: {
            rest: {
                method: "GET",
                path: "/"
            },
            async handler(ctx) {
                this.adapter.find().then((result) => {
                    return result;
                })
            }
        },
        getByID: {
            rest: {
                method: "GET",
                path: "/"
            },
            async handler(ctx) {
                // console.log(ctx.params);
                this.adapter.findOne({ _id: new ObjectId(ctx.params.id) }).then((result) => {
                    // console.log(result);
                    return result;
                })
            }
        },
    },
    events: {
        "data.recieved": {
            group: "other",
            async handler(payload) {
                // console.log("Recieved data.recieved signal in data service with payload ", payload);
                this.adapter.insert(payload)
                this.broker.emit("analytics.data", payload);
            }
        }
    },
    created() {
        const app = express();
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        app.listen(this.settings.port);
        this.app = app;
    }
}