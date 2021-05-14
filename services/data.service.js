"use strict";

const express = require("express")
const bodyParser = require("body-parser")

module.exports = {
    name: "data",
    settings: {
        port: process.env.PORT || 3000
    },
    methods: {
        initRoutes(app){
            app.get("/data",this.getData);
        },
        getData(req, res){
        },
    },
    events: {
        "data.recieved" : {
            group: "other",
            handler(payload){
                console.log("Recieved data.recieved signal in data.service with payload ", payload);
            }
        }
    },
    created(){
        const app = express();
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(bodyParser.json());
        app.listen(this.settings.port);
        this.initRoutes(app);
        this.app=app;
    }
}