"use strict";

module.exports = {
	name: "actuator",
	actions: {
		low: {
			async handler(ctx) {
				// console.log(ctx.params);
                // smanji threshold za x % od primljene cene
                // povecaj interval
                // redje proverava o cenu ali je nizi prag
                const recieved = ctx.params;
                const newParams = {
                    interval: recieved.interval*1.01,
                    threshold: recieved.threshold-recieved.price*0.01
                }
                this.broker.call(`sensor.setParams`, newParams);
                console.log(`Success decreasing threshold (${recieved.threshold} -> ${newParams.threshold}) and increasing interval (${recieved.interval} -> ${newParams.interval})!`);
			}
        },
		high: {
			async handler(ctx) {
				// console.log(ctx.params);
                // povecaj threshold za x % od primljene cene
                // smanji interval
                // cesce proverava o cenu ali je visi prag
                const recieved = ctx.params;
                const newParams = {
                    interval: recieved.interval*0.99,
                    threshold: recieved.threshold+recieved.price*0.01
                }
                this.broker.call(`sensor.setParams`, newParams);
                console.log(`Success increasing threshold (${recieved.threshold} -> ${newParams.threshold}) and decreasing interval (${recieved.interval} -> ${newParams.interval})!`);
			}
        }
	}
};