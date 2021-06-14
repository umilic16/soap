"use strict";

const express = require("express");
const bodyParser = require("body-parser");

const fs = require('fs');
const { stopped } = require("moleculer-web");

module.exports = {
    name: "sensor",
    settings: {
        port: process.env.PORT || 3000
    },
    methods: {
        startReading() {
            fs.readFile('dodgecoinstats.json', 'utf8', (err, jsonString) => {
                if (err) {
                    console.log("Error reading file from disk:", err)
                    return
                }
                try {
                    const data = JSON.parse(jsonString)
                    this.intr = setInterval(() => {
                        let element = data[this.index];
                        // console.log(element["Open"], this.interval, this.threshold);
                        if (element["Open"] > this.threshold) {
                            // console.log("Sensor service sending to data service: ", element);
                            this.broker.emit("data.recieved", element);
                        }
                        this.index++;
                    }, this.interval);
                } catch (err) {
                    console.log('Error parsing JSON string:', err)
                }
            })
        }
    },
    actions: {
        getParams: {
            rest: {
                method: "GET",
                path: "/"
            },
            async handler(ctx) {
                // console.log("test 123 test 123");
                return {
                    type: this.type,
                    interval: this.interval,
                    threshold: this.threshold
                }
            }
        },
        setParams: {
            rest: {
                method: "POST",
                path: "/"
            },
            async handler(ctx) {
                const body = ctx.params;
                // console.log(ctx);
                this.type = body.type ? body.type : this.type;
                this.interval = body.interval ? body.interval : this.interval;
                this.threshold = body.threshold ? body.threshold : this.threshold;
                clearInterval(this.intr);
                this.startReading();
                return "Sensor edited";
            }
        },
        changeThreshold: {
            rest: {
                method: "POST",
                path: "/changeThreshold",
            },
            async handler(ctx) {
                // console.log("change price ctx: ", ctx);
                const send = {
                    interval: this.interval,
                    threshold: this.threshold,
                    price: ctx.params.payload
                }
                // console.log(`Calling command ${ctx.params.command} cause the price is ${ctx.params.payload}`);
                if (ctx.params.command == "high") {
                    this.broker.call("actuator.high", send);
                }
                else {
                    this.broker.call("actuator.low", send);
                }
            },
        },
    },
    created() {
        const app = express();
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        app.listen(this.settings.port);
        this.type = "default";
        this.interval = 5000;
        this.threshold = 0.0004;
        this.index=0;
        this.startReading();
        this.app = app;
    }
}