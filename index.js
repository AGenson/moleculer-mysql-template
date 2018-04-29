"use strict";

const { ServiceBroker } = require("moleculer");
const DatabaseServices = require("./src/fixtures/database_template/Database.ServiceTemplate");

const broker = new ServiceBroker({ logger: console });



broker.loadServices("./src/services");

DatabaseServices.forEach( (service) => {
	broker.createService(service);
});



broker.start()
	.then( () => {
		broker.repl();
		broker.call("users.createAdminIfNotExists")
			.then( () => console.log("Server started"));
	});
