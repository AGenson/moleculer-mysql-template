"use strict";

const jwt	= require("jsonwebtoken");
const passwordHash = require('password-hash');
const { pick } = require("lodash");
const Promise = require("bluebird");
const { MoleculerError } 	= require("moleculer").Errors;
const Database = require("../adapters/Database");
const Request = require("../mixins/request.mixin");
const CodeTypes = require("../fixtures/error.codes");

// Filters applied when searching for entities
// Elements correspond to the columns of the table
const Filters_Users = {
	security: ["id", "username", "password", "role"],
	encode: ["id", "username", "role"]
};
const Filters_Tokens = {
	empty: ["id"]
};

const JWT_SECRET = "TOP SECRET!!!";



module.exports = {
	name: "auth",

	mixins: [ Request ],

	actions: {

		login: {
			params: {
				username: "string",
				password: "string"
			},
			handler(ctx) {
				return ctx.call("auth.verifyPassword", { username: ctx.params.username, password: ctx.params.password })
					.then( (res) => {
						return this.generateToken(res.data)
							.then( (res2) => {
								return this.DB_Tokens.insert(ctx, {
										userId: res.data.id,
										token: res2
									})
									.then( () => this.requestSuccess("Login Success", res2) );
							})
					})
					.catch( (err) => {
						if (err instanceof MoleculerError)
							return Promise.reject(err);
						else
							return this.requestError(CodeTypes.UNKOWN_ERROR);
					});
			}
		},

		verifyPassword: {
			params: {
				username: "string",
				password: "string"
			},
			handler(ctx) {
				return this.DB_Users.findOne(ctx, {
						query: {
							username: ctx.params.username
						},
						filter: Filters_Users.security
					})
					.then( (res) => {
						if (passwordHash.verify(ctx.params.password, res.data.password))
							return this.requestSuccess("Valid Password", pick(res.data, Filters_Users.encode));
						else
							return this.requestError(CodeTypes.AUTH_INVALID_CREDENTIALS);
					})
					.catch( (err) => {
						if (err instanceof MoleculerError)
							return Promise.reject(err);
						else if (err.name === 'Nothing Found')
							return this.requestError(CodeTypes.USERS_NOTHING_FOUND);
						else
							return this.requestError(CodeTypes.UNKOWN_ERROR);
					});
			}
		},

		verifyToken: {
			params: {
				token: "string"
			},
			handler(ctx) {
				return this.DB_Tokens.findOne(ctx, {
						query: {
							token: ctx.params.token
						}
					})
					.then( () => this.verify(ctx.params.token, JWT_SECRET))
					.catch( () => undefined );
			}
		},

		countSessions: {
			params: {

			},
			handler(ctx) {
				return this.verifyIfLogged(ctx)
					.then( () => this.DB_Tokens.count(ctx, {
						userId: ctx.meta.user.id
					}))
					.then( (res) => this.requestSuccess("Count Complete", res.data) )
					.catch( (err) => {
						if (err instanceof MoleculerError)
							return Promise.reject(err);
						else
							return this.requestError(CodeTypes.UNKOWN_ERROR);
					});
			}
		},

		closeAllSessions: {
			params: {

			},
			handler(ctx) {
				return this.verifyIfLogged(ctx)
					.then( () => this.DB_Tokens.removeMany(ctx, {
						userId: ctx.meta.user.id
					}))
					.then( () => this.requestSuccess("All existing sessions closed", true) )
					.catch( (err) => {
						if (err instanceof MoleculerError)
							return Promise.reject(err);
						else
							return this.requestError(CodeTypes.UNKOWN_ERROR);
					});
			}
		},

		logout: {
			params: {

			},
			handler(ctx) {
				return this.verifyIfLogged(ctx)
					.then( () => this.DB_Tokens.removeMany(ctx, {
						token: ctx.meta.user.token
					}))
					.then( () => this.requestSuccess("Logout Success", true) )
					.catch( (err) => {
						if (err instanceof MoleculerError)
							return Promise.reject(err);
						else
							return this.requestError(CodeTypes.UNKOWN_ERROR);
					});
			}
		}

	},

	methods: {

		generateToken(user) {
			return this.encode(user, JWT_SECRET);
		},

		verifyIfLogged(ctx){
			if (ctx.meta.user !== undefined)
				return this.requestSuccess("User Logged", true);
			else
				return this.requestError(CodeTypes.USERS_NOT_LOGGED_ERROR);
		}

	},

	created() {
		// Create Promisify encode & verify methods
		this.encode = Promise.promisify(jwt.sign);
		this.verify = Promise.promisify(jwt.verify);

		this.DB_Users = new Database("User", Filters_Users.token);
		this.DB_Tokens = new Database("Token", Filters_Tokens.empty);
	}
};
