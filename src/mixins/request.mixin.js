"use strict";

const { MoleculerError } = require("moleculer").Errors;
const CodeTypes = require("../fixtures/error.codes");


// Common methods for request answer to different services
module.exports = {
	methods: {

		requestSuccess(name, message) {
			return {
				name: name,
				message: message,
				code: 200
			};
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
