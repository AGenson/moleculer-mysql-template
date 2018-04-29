"use strict";

const Sequelize = require("sequelize");

// For more information about Sequelize Data Types :
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types



module.exports = {
	name: "user",
	define: {
		id: { // id must always exist
			type: Sequelize.UUID, // Uses uuidv4 by default (default value is recommended)
			primaryKey: true,
			defaultValue: Sequelize.UUIDV4
		},

		username: {
			type: Sequelize.STRING(20),
			allowNull: false,
			unique: true
		},

		password: {
			type: Sequelize.TEXT,
			allowNull: false
		},

		role: {
			type: Sequelize.STRING(10),
			allowNull: false,
			defaultValue: "USER"
		},

		age: {
			type: Sequelize.INTEGER,
			allowNull: true
		}
	},
	options: {
		timestamps: false
	}
};
