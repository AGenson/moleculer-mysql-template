"use strict";

const Promise = require("bluebird");
const { MoleculerError } = require("moleculer").Errors;
const CodeTypes = require("../fixtures/error.codes");


// Common methods for request answer to different services
module.exports = {
	methods: {

		requestSuccess(name, data) {
			return Promise.resolve({
				name: name,
				data: data,
				code: 200
			});
		},

		requestError(codeError) {
			var message, code;

			switch (codeError) {

				// Errors on Table1

				case CodeTypes.T1_NOTHING_FOUND:
					message = "No entity found in Table1 with the given parameters";
					code = 404;
					break;

				case CodeTypes.T1_FIRST_CONSTRAINT:
					message = "First must be unique: not all entities have been inserted or updated";
					code = 417;
					break;

				case CodeTypes.T1_THIRD_CONSTRAINT:
					message = "Third must be a number";
					code = 417;
					break;

				// Errors on Table2

				case CodeTypes.T2_NOTHING_FOUND:
					message = "No entity found in Table2 with the given parameters";
					code = 404;
					break;

				case CodeTypes.T2_SECOND_CONSTRAINT:
					message = "Second must be a number";
					code = 417;
					break;

				// Errors on Table1 & Table2

				case CodeTypes.T1_T2_NOTHING_FOUND:
					message = "Table1 or Table2 is empty";
					code = 404;
					break;

				// Errors on Users

				case CodeTypes.USERS_NOT_LOGGED_ERROR:
					message = "Action need a logged user";
					code = 401;
					break;

				case CodeTypes.USERS_NOTHING_FOUND:
					message = "Username does not exist";
					code = 404;
					break;

				case CodeTypes.USERS_USERNAME_CONSTRAINT:
					message = "Username already used";
					code = 417;
					break;

				case CodeTypes.USERS_FORBIDDEN_REMOVE:
					message = "ADMIN User cannot be removed";
					code = 403;
					break;

				case CodeTypes.USERS_INVALID_ROLE:
					message = "Role Unknown";
					code = 417;
					break;

				// Errors on Auth

				case CodeTypes.AUTH_INVALID_CREDENTIALS:
					message = "Wrong password";
					code = 417;
					break;

				case CodeTypes.AUTH_ADMIN_RESTRICTION:
					message = "Action need ADMIN permission";
					code = 401;
					break;

				case CodeTypes.AUTH_ACCESS_DENIED:
					message = "Role invalid for this action";
					code = 401;
					break;

				case CodeTypes.AUTH_INVALID_TOKEN:
					message = "Invalid Token: verification of authentification failed";
					code = 401;
					break;

				case CodeTypes.AUTH_NO_TOKEN:
					message = "Missing Token: a logged User is required for this kind of request";
					code = 401;
					break;

				// Unknown Error

				default:
					message = "Operation failed internally: unknown details";
					code = 500;
					break;
			}

			return this.Promise.reject(new MoleculerError(codeError, code, "ERR_CRITIAL", { code: code, message: message }));
		}
	}
};
