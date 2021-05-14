"use strict";

const express = require("express")
const bodyParser = require("body-parser")
const DbService = require("../mixins/db.mixin")

module.exports = {
    name: "data",
    mixins: [
		DbService("movies")
	],
    settings: {
        port: process.env.PORT || 3000
    },
    methods: {
        initRoutes(app){
            app.get("/data",this.getData); 
        },
        getData(req, res){
            this.adapter.find().then((result)=>{
                res.send(result);
            })
        },
    },
    events: {
        "data.recieved" : {
            group: "other",
            handler(payload){
                //console.log("Recieved data.recieved signal in data service with payload ", payload);
                this.adapter.insert(payload)
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