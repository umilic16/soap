"use strict"

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

module.exports = {
    name: "data",
    settings: {
        port: process.env.PORT || 3000,
    },
    methods:{
        initRoutes(){
            app.get("/data", getData);
        },
        init(){

        }

    },
    created(){
        const app = express();
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        app.listen(this.settings.port);
        this.initRoutes(app);
        this.app = app;
        this.init();
    }
}