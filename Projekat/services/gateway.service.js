const gateway = require("moleculer-web");
const express = require("express");

module.exports = {
    name: "gateway",
    mixins: [gateway],

    settings: {
        port: process.env.PORT || 3000,
        ip: "0.0.0.0",
        // Global CORS settings for all routes
        cors: {
            // Configures the Access-Control-Allow-Origin CORS header.
            origin: "*",
            // Configures the Access-Control-Allow-Methods CORS header. 
            methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
            // Configures the Access-Control-Allow-Headers CORS header.
            allowedHeaders: [],
            // Configures the Access-Control-Expose-Headers CORS header.
            exposedHeaders: [],
            // Configures the Access-Control-Allow-Credentials CORS header.
            credentials: false,
            // Configures the Access-Control-Max-Age CORS header.
            maxAge: 3600
        },

        routes: [{
            path: "/api",

            // Route CORS settings (overwrite global settings)
            // cors: {
            //     origin: ["http://localhost:3000", "https://localhost:4000"],
            //     methods: ["GET", "OPTIONS", "POST"],
            //     credentials: true
            // },
            // aliases: {
            //     "GET users": "users.list",
            //     "GET users/:id": "users.get",
            //     "POST users": "users.create",
            //     "PUT users/:id": "users.update",
            //     "DELETE users/:id": "users.remove"
            // },
            aliases: {
                "GET /sensor": "sensor.getParams",
                "GET /data": "data.getData",
                "GET /data/:id": "data.getByID",
                "POST /sensor": "sensor.setParams",
            },
            autoAliases: true
        }]
    },
    started() {
        const app = express();

        // Use ApiGateway as middleware
        // app.use("/api", this.express());
        // app.listen(this.settings.port);
        // this.app = app;
        // Listening
        // app.listen(4321, err => {
        //     if (err)
        //         return console.error(err);

        //     console.log("Open http://localhost:4321/api/test/hello");
        // });
    }
}