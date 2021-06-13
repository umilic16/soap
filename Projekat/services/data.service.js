"use strict";

const express = require("express")
const bodyParser = require("body-parser")
const ObjectId = require("mongodb").ObjectID;
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
            app.get("/data/:id",this.getByID);
        },
        /** 
         * @swagger
         * /data:
         * get:
         *  description: Get request koji vraca sve podatke upisane u bazu
         * responses:
         *  200:
         *      description: Uspesan zahtev..........
        */
        getData(req, res){
            this.adapter.find().then((result)=>{
                res.send(result);
            })
        },
        getByID(req, res){
            this.adapter.findOne({_id: new ObjectId(req.params.id)}).then((result)=>{
                // console.log(result);
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
                this.broker.emit("analytics.data", payload);
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