"use strict"

const express = require("express");
const bodyParser = require("body-parser");

module.exports={
    name: "sensordevice",
    settings: {
        port: process.env.PORT || 3000
    },
    methods:{
        initRoutes(app)
        {
            app.get("/sensordevice", this.getParams);
            app.post("/sensordevice",this.setParams);
        },
        init(){
            var data = require('../data/dodgecoinstats.json');
            let index=0;
            setInterval(()=>{
                console.log(data[index]);
                index++;
            }, this.interval);
        },
        getParams(req, res)
        {
            res.json({
                type: this.type,
                interval: this.interval,
                threshold: this.threshold
            })
        },
        setParams(req,res)
        {
            var sensor = req.body;
            this.type=sensor.type;
            this.interval=sensor.interval;
            this.threshold=sensor.threshold;
        }
    },
    created(){
        this.type = "default";
        this.interval=1000;
        this.threshold=0;
        const app = express();
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        app.listen(this.settings.port);
        this.initRoutes(app);
        this.app = app;
        this.init();
    }
}