module.exports = {
	name: "command",
	events: {
		"lowPrice": {
			handler(payload) {
				// console.log("Command servis low pozvan payload: ", payload);
                this.broker.call("sensor.changeThreshold", { command: "low", payload: payload });
			}
		},
        "highPrice": {
			handler(payload) {
                // console.log("Command servis high pozvan payload: ", payload);
				this.broker.call("sensor.changeThreshold", { command: "high", payload: payload });
			}
		},
	}
}