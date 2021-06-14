const ApiGateway = require('moleculer-web');
const IO = require("socket.io");

module.exports = {
    name: "gateway",
    mixins: [ApiGateway],

    settings: {
        port: process.env.PORT || 3000,
        ip: "0.0.0.0",
        cors: {
            // Configures the Access-Control-Allow-Origin CORS header.
            origin: "*",
            // Configures the Access-Control-Allow-Methods CORS header.
            methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
            // Configures the Access-Control-Allow-Headers CORS header.
            allowedHeaders: ['content-type'],
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
            //     "GET /sensor": "sensor.getParams",
            //     "GET /data": "data.getData",
            //     "GET /data/:id": "data.getByID",
            //     "POST /sensor": "sensor.setParams",
            //     "GET /gateway/list-aliases" : "gateway.listAliases"
            // },
            autoAliases: true
        }],
    },
    started() {
        this.io = IO(this.server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        this.io.on("connection", client => {
            this.logger.info("Client connected via websocket!");

            client.on("disconnect", () => {
                this.logger.info("Client disconnected");
            });

        });
    }
};