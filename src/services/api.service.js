"use strict";

const ApiGateway = require("moleculer-web");


module.exports = {
	name: "api",

	mixins: [ ApiGateway],

	settings: {
		port: process.env.PORT || 9000,

        cors: {
            origin: "*",
            methods: ["GET", /*"PATCH", "OPTIONS",*/ "POST", "PUT", "DELETE"],
            allowedHeaders: ["Content-Type"],
            exposedHeaders: [],
            credentials: false,
            maxAge: 3600
		},

		//path: "/api",

		routes: [

			{
				path: "/greeter/",
				whitelist: [
					"greeter.*"
				],
				aliases: {
					"GET hello": "greeter.hello",
					"POST welcome/:name": "greeter.welcome"
				}
			},
			{
				bodyParsers: {
	                json: true,
	            },
				path: "/serviceA/",
				whitelist: [
					"serviceA.*"
				],
				aliases: {
					"POST one": "serviceA.create",
					"POST many": "serviceA.createMany",
					"GET all": "serviceA.getAll",
					"GET ids": "serviceA.getAllIds",
					"GET first/:first": "serviceA.getByFirst",
					"GET id/:id": "serviceA.getById",
					"GET count": "serviceA.count",
					"PUT one": "serviceA.update",
					"PUT many": "serviceA.updateMany",
					"DELETE byId/:id": "serviceA.remove",
					"DELETE byFirst/:first": "serviceA.removeByFirst",
					"DELETE byThird/:third": "serviceA.removeByThird",
					"DELETE all": "serviceA.removeAll"
				}
			},
			{
				bodyParsers: {
	                json: true,
	            },
				path: "/serviceB/",
				whitelist: [
					"serviceB.*"
				],
				aliases: {
					// ServiceB: Table2 only
					"POST one": "serviceB.create",
					"POST many": "serviceB.createMany",
					"GET all": "serviceB.getAll",
					"GET ids": "serviceB.getAllIds",
					"GET first/:first": "serviceB.getByFirst",
					"GET id/:id": "serviceB.getById",
					"GET count": "serviceB.count",
					"PUT one": "serviceB.update",
					"PUT many": "serviceB.updateMany",
					"DELETE byId/:id": "serviceB.remove",
					"DELETE byFirst/:first": "serviceB.removeByFirst",
					"DELETE byThird/:third": "serviceB.removeByThird",
					"DELETE all": "serviceB.removeAll",

					// ServiceB: Table1 & Table2
					"GET all/tables": "serviceB.getAll_1_2",
				}
			}
		]

	}
};
