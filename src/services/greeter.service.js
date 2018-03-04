"use strict";

module.exports = {
	name: "greeter",

	settings: {

	},

	metadata: {

	},

	actions: {

		/**
		 * Say a 'Hello'
		 *
		 * @returns
		 */
		hello() {
			return "Hello Moleculer";
		},

		/**
		 * Welcome a username
		 *
		 * @param {String} name - User name
		 */
		welcome: {
			params: {
				name: "string"
			},
			handler(ctx) {
				return `Welcome, ${ctx.params.name}`;
			}
		}
	},

	events: {

	},

	methods: {

	},

	created() {

	},

	started() {
		console.log(`Service ${this.name} up and running`);
	},

	stopped() {
		console.log(`Service ${this.name} down`);
	}
};
