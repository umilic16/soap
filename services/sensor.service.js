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
    apis: ['sensor.service.js'],
  };
  
  // initialize swagger-jsdoc
  var swaggerSpec = swaggerJsDoc(options);


module.exports = {
    name: "sensor",
    settings: {
        port: process.env.PORT || 3000
    },
    methods: {
        init(){
            this.type="default";
            this.interval=5000;
            this.threshold=50;
            fs.readFile('dodgecoinstats.json', 'utf8', (err, jsonString) => {
                if (err) {
                    console.log("Error reading file from disk:", err)
                    return
                }
                try {
                    const data = JSON.parse(jsonString)
                    let index = 0;
                    var intr = setInterval(() =>{
                        let element=data[index];
                        //console.log("Current element: ", element);
                        if(element["Open"]>this.threshold)
                            var a;
                        this.broker.emit("data.recieved", element);
                        index++;
                    }, this.interval);
                    // this.scanData(data,index);
                } catch(err) {
                    console.log('Error parsing JSON string:', err)
                }
            })
        },
        scanData(data,index){
        },
        initRoutes(app){
            /**
             * @swagger
             * get:
             *  description: Get
             */
            app.get("/sensor",this.getParams);
            /**
             * @swagger
             * post:
             *  description: Post
             */
            app.post("/sensor",this.setParams);
        },
        /**
         * @swagger
         *  /sensor:
         *  get:
         *      description: Get request za dobijanje trenutnih parametra senzora
         *  responses:
         *  200:
         *      description: Uspesan zahtev, request daje parametre senzora
         */
        getParams(req, res){
            res.json({
                type: this.type,
                interval: this.interval,
                threshold: this.threshold
            })
        },
        /**
         * @swagger
         * /sensor:
         * post:
         *  description: Post request za izmenu parametra senzora
         * responses:
         * 200:
         *  description: Uspesan zahtev, promenjeni parametri senzora
         */
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
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    }
}