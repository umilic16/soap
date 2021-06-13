"use strict";

const express = require("express")
const bodyParser = require("body-parser")

const fs = require('fs')

const swaggerJsDoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

// const swaggerOptions = {
//     swaggerDefinition: {
//         info:{
//             title: "API Documentation",
//             description: "Projekat 1 - SOA. API Documentation",
//             contact:{
//                 name: "Uros Milic"
//             },
//             servers: ["http://localhost:3000"]
//         }
//     },
//     apis:[".services/*.js"]
// };

// const swaggerSpec = swaggerJsDoc(swaggerOptions);
// swagger definition
var swaggerDefinition = {
    info: {
      title: 'Node Swagger API',
      version: '1.0.0',
      description: 'Demonstrating how to describe a RESTful API with Swagger',
    },
    host: 'localhost:3000',
    basePath: '/',
  };
  
  // options for the swagger docs
  var options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ["sensor.service.js"],
  };
  
  // initialize swagger-jsdoc
  var swaggerSpec = swaggerJsDoc(options);

//swagger odbija da saradjuje posle 100000 pokusaja

module.exports = {
    name: "sensor",
    settings: {
        port: process.env.PORT || 3000
    },
    methods: {
        init(){
            this.type="default";
            this.interval=5000;
            //da koristim threshold kao prosecna cena?
            this.threshold=0.0004;
            this.startReading();
        },
        initRoutes(app){
            /**
             * @swagger
             * path:
             *  /sensor:
             * get:
             *  description: Get
             */
            app.get("/sensor",this.getParams);
            /**
             * @swagger
             * path:
             *  /sensor:
             * post:
             *  description: Post
             */
            app.post("/sensor",this.setParams);
        },
        startReading(){
            fs.readFile('dodgecoinstats.json', 'utf8', (err, jsonString) => {
                if (err) {
                    console.log("Error reading file from disk:", err)
                    return
                }
                try {
                    const data = JSON.parse(jsonString)
                    let index = 0;
                    this.intr = setInterval(() =>{
                        let element=data[index];
                        // console.log(element["Open"], this.interval, this.threshold);
                        if(element["Open"]>this.threshold)
                            this.broker.emit("data.recieved", element);
                        index++;
                    }, this.interval);
                    // this.scanData(data,index);
                } catch(err) {
                    console.log('Error parsing JSON string:', err)
                }
            })
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
            clearInterval(this.intr);
            this.startReading();
            res.send("Sensor edited");
        }
    },
    created(){
        const app = express();
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(bodyParser.json());
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
        app.listen(this.settings.port);
        this.initRoutes(app);
        this.init();
        this.app=app;
    }
}