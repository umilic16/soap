"use strict";

const express = require("express")
const bodyParser = require("body-parser")

module.exports = {
    name: "sensor",
    settings: {
        port: process.env.PORT || 3000
    },
    methods: {
        init(){
            this.type="default";
            this.interval=1000;
            this.threshold=0;
            this.index=0;
            this.data = json.parse("../dodgecoinstats.json");
            while(1){
                this.element=data[index]["Open"];
                if(element>threshold)
                {
                    console.log("Current element: ", element);
                    this.broker.emit("data.recieved", element);
                }
                else
                    setTimeout(interval);
                index++;
            }
        },
        initRoutes(app){
            app.get("/sensor",this.getParams);
            app.post("/sensor",this.setParams);
        },
        getParams(req, res){
            res.send(json.parse({
                type: this.type,
                interval: this.interval,
                threshold: this.threshold
            }))
        },
        setParams(req, res){
            const body = req.body;
            this.type = body.type;
            this.interval = body.interval;
            this.threshold = body.threshold;
        }
    },
    created(){
        const app = express();
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(bodyParser.json());
        app.listen(this.settings.port);
        this.initRoutes(app);
        this.init();
        this.app=app;
    }
}