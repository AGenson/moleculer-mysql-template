"use strict";

const Sequelize = require("sequelize");

// For more information about Sequelize Data Types :
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types



module.exports = {
	name: "token",
	define: {
		id: { // id must always exist
			type: Sequelize.UUID, // Uses uuidv4 by default (default value is recommended)
			primaryKey: true,
			defaultValue: Sequelize.UUIDV4
		},

		token: {
			type: Sequelize.TEXT,
			allowNull: false
		},

		userId: {
			type: Sequelize.UUID,
			allowNull: false
		}
	},
	options: {
		timestamps: false
	}
};
