"use strict";

const express = require("express")
const bodyParser = require("body-parser")

const fs = require('fs')


module.exports = {
    name: "sensor",
    settings: {
        port: process.env.PORT || 3000
    },
    methods: {
        init(){
            this.type="default";
            this.interval=1000;
            this.threshold=50;
            fs.readFile('dodgecoinstats.json', 'utf8', (err, jsonString) => {
                if (err) {
                    console.log("Error reading file from disk:", err)
                    return
                }
                try {
                    const data = JSON.parse(jsonString)
                    let index = 0;
                    var intr = setInterval(() =>
                    {
                        let element=data[index];
                        //console.log("Current element: ", element);
                        if(element["Open"]>this.threshold)
                            var a;
                        this.broker.emit("data.recieved", element);
                        index++;
                        clearInterval(intr);
                    }, this.interval);
                } catch(err) {
                    console.log('Error parsing JSON string:', err)
                }
            })
        },
        scanData(data,index){

        },
        initRoutes(app){
            app.get("/sensor",this.getParams);
            app.post("/sensor",this.setParams);
        },
        getParams(req, res){
            res.json({
                type: this.type,
                interval: this.interval,
                threshold: this.threshold
            })
        },
        setParams(req, res){
            const body = req.body;
            this.type = body.type;
            this.interval = body.interval;
            this.threshold = body.threshold;
            res.send("Sensor edited");
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