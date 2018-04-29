"use strict";

const Promise = require("bluebird");
const ApiGateway = require("moleculer-web");
const { MoleculerError } 	= require("moleculer").Errors;
const Request = require("../mixins/request.mixin");
const CodeTypes = require("../fixtures/error.codes");


module.exports = {
	name: "api",

	mixins: [
		ApiGateway,
		Request
	],

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
				bodyParsers: {
						json: true,
				},
				path: "/public/",
				authorization: false,
				whitelist: [
					"auth.login",
					"users.create"
				],
				aliases: {
					// Auth: login only
					"POST login": "auth.login",

					// Users: create User account only
					"POST user": "users.create"
				}
			},
			{
				bodyParsers: {
						json: true,
				},
				path: "/admin/",
				roles: ["ADMIN"],
				authorization: true,
				whitelist: [
					"users.*"
				],
				aliases: {
					// Users: Actions on Users that needs priviledges
					"GET users/count": "users.count",
					"PUT user/change/role/:username/:role": "users.changeRole",
					"DELETE banish/:username": "users.banish",
					"DELETE users": "users.removeAll",
				}
			},
			{
				bodyParsers: {
						json: true,
				},
				path: "/common/",
				roles: ["ADMIN", "USER"],
				authorization: true,
				whitelist: [
					"auth.countSessions",
					"auth.logout",
					"auth.closeAllSessions",
					"users.getAll",
					"users.get",
					"users.changeInfo",
					"users.changePassword",
					"users.remove"
				],
				aliases: {
					// Auth: Session Controls only
					"GET sessions": "auth.countSessions",
					"DELETE logout": "auth.logout",
					"DELETE sessions": "auth.closeAllSessions",

					// Users: Actions on Users that does not need priviledges
					"GET users": "users.getAll",
					"GET user/:username": "users.get",
					"PUT user/change/infos": "users.changeInfo",
					"PUT user/change/password": "users.changePassword",
					"DELETE user": "users.remove",
				}
			},
			{
				path: "/greeter/",
				authorization: false,
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
				path: "/services/",
				roles: ["ADMIN", "USER"],
				authorization: true,
				whitelist: [
					"serviceA.*",
					"serviceB.*"
				],
				aliases: {
					// ServiceA: Table1 only
					"POST A/one": "serviceA.create",
					"POST A/many": "serviceA.createMany",
					"GET A/all": "serviceA.getAll",
					"GET A/ids": "serviceA.getAllIds",
					"GET A/first/:first": "serviceA.getByFirst",
					"GET A/id/:id": "serviceA.getById",
					"GET A/count": "serviceA.count",
					"PUT A/one": "serviceA.update",
					"PUT A/many": "serviceA.updateMany",
					"DELETE A/byId/:id": "serviceA.remove",
					"DELETE A/byFirst/:first": "serviceA.removeByFirst",
					"DELETE A/byThird/:third": "serviceA.removeByThird",
					"DELETE A/all": "serviceA.removeAll",

					// ServiceB: Table2 only
					"POST B/one": "serviceB.create",
					"POST B/many": "serviceB.createMany",
					"GET B/all": "serviceB.getAll",
					"GET B/ids": "serviceB.getAllIds",
					"GET B/first/:first": "serviceB.getByFirst",
					"GET B/id/:id": "serviceB.getById",
					"GET B/count": "serviceB.count",
					"PUT B/one": "serviceB.update",
					"PUT B/many": "serviceB.updateMany",
					"DELETE B/byId/:id": "serviceB.remove",
					"DELETE B/byFirst/:first": "serviceB.removeByFirst",
					"DELETE B/byThird/:third": "serviceB.removeByThird",
					"DELETE B/all": "serviceB.removeAll",

					// ServiceB: Table1 & Table2
					"GET B/all/tables": "serviceB.getAll_1_2"
				}
			}

		]

	},

	methods: {

		authorize(ctx, route, req) {
			var authValue = req.headers["authorization"];

			if (authValue && authValue.startsWith("Bearer ")) {
				var token = authValue.slice(7);

				return ctx.call("auth.verifyToken", { token })
					.then( (decoded) => {
						if (route.opts.roles.indexOf(decoded.role) === -1)
							return this.requestError(CodeTypes.AUTH_ACCESS_DENIED);

						ctx.meta.user = decoded;
						ctx.meta.user.token = token;
					})
					.catch( (err) => {
						if (err instanceof MoleculerError)
							return Promise.reject(err);

						return this.requestError(CodeTypes.AUTH_INVALID_TOKEN);
					});

			} else
				return this.requestError(CodeTypes.AUTH_NO_TOKEN);
		}
	}
};
