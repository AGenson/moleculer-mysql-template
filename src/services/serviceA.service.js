"use strict";

const Database = require("../adapters/Database");
const Request = require("../mixins/request.mixin");
const CodeTypes = require("../fixtures/error.codes");

// Filters applied when searching for entities
// Elements correspond to the columns of the table
const Filters_T1 = {
	full: ["id", "first", "second", "third"],
	two: ["id", "first", "second"],
	one: ["id", "first"],
	id: ["id"]
};



module.exports = {
	name: "serviceA",

	mixins: [ Request ],

	actions: {

		create: {
			params: {
				first: "string",
				second: "string",
				third: "number"
			},
			handler(ctx) {
				return this.DB_Table1.insert(ctx, {
						first: ctx.params.first,
						second: ctx.params.second,
						third: ctx.params.third
					})
					//.then( (res) => res )
					.catch( (err) => { // A 'notNull' error can also occur if a field is defined by 'allowNull: false'
						if (err.name === 'Database Error' && Array.isArray(err.data)){
							if (err.data[0].type === 'unique' && err.data[0].field === 'first')
								return this.requestError(CodeTypes.T1_FIRST_CONSTRAINT);
						}

						return this.requestError(CodeTypes.UNKOWN_ERROR);
					});
			}
		},

		createMany: {
			params: {
				entities: { type: "array", optional: false, items: "object" }
			},
			handler(ctx) {
				return this.DB_Table1.insertMany(ctx, ctx.params.entities)
					//.then( (res) => res )
					.catch( (err) => { // A 'notNull' error can also occur if a field is defined by 'allowNull: false'
						if (err.name === 'Database Error' && Array.isArray(err.data)){
							if (err.data[0].type === 'unique' && err.data[0].field === 'first')
								return this.requestError(CodeTypes.T1_FIRST_CONSTRAINT);
						}

						return this.requestError(CodeTypes.UNKOWN_ERROR);
					});
			}
		},

		getAll: {
			params: {

			},
			handler(ctx) {
				return this.DB_Table1.find(ctx)
					//.then( (res) => res )
					.catch( (err) => {
						if (err.name === 'Nothing Found')
							return this.requestError(CodeTypes.T1_NOTHING_FOUND);
						else
							return this.requestError(CodeTypes.UNKOWN_ERROR);
					});
			}
		},

		getAllIds: {
			params: {

			},
			handler(ctx) {
				return this.DB_Table1.find(ctx, {
						//query: { },
						filter: Filters_T1.id
					})
					.then( (res) => {
						var result = res;

						result.data = res.data.map( (item) => item.id );

						return res;
					})
					.catch( (err) => {
						if (err.name === 'Nothing Found')
							return this.requestError(CodeTypes.T1_NOTHING_FOUND);
						else
							return this.requestError(CodeTypes.UNKOWN_ERROR);
					});
			}
		},

		getByFirst: {
			params: {
				first: "string"
			},
			handler(ctx) {
				return this.DB_Table1.findOne(ctx, {
						query: {
							first: ctx.params.first
						},
						//filter: Filters_T1.full
					})
					//.then( (res) => res )
					.catch( (err) => {
						if (err.name === 'Nothing Found')
							return this.requestError(CodeTypes.T1_NOTHING_FOUND);
						else
							return this.requestError(CodeTypes.UNKOWN_ERROR);
					});
			}
		},

		getById: {
			params: {
				id: "string"
			},
			handler(ctx) {
				return this.DB_Table1.findById(ctx, {
						id: ctx.params.id,
						//filter: Filters_T1.full
					})
					//.then( (res) => res )
					.catch( (err) => {
						if (err.name === 'Nothing Found')
							return this.requestError(CodeTypes.T1_NOTHING_FOUND);
						else
							return this.requestError(CodeTypes.UNKOWN_ERROR);
					});
			}
		},

		count: {
			params: {

			},
			handler(ctx) {
				return this.DB_Table1.count(ctx, { })
					//.then( (res) => res )
					.catch( (err) => this.requestError(CodeTypes.UNKOWN_ERROR) );
			}
		},

		update: {
			params: {
				id: "string",
				first: "string",
				second: "string",
				third: "number"
			},
			handler(ctx) {
				return this.DB_Table1.updateById(ctx, ctx.params.id, {
						first: ctx.params.first,
						second: ctx.params.second,
						third: ctx.params.third
					})
					//.then( (res) => res )
					.catch( (err) => {
						if (err.name === 'Database Error' && Array.isArray(err.data)){
							if (err.data[0].type === 'unique' && err.data[0].field === 'first')
								return this.requestError(CodeTypes.T1_FIRST_CONSTRAINT);
						}
						else if (err.name === 'Nothing Found')
							return this.requestError(CodeTypes.T1_NOTHING_FOUND);
						else
							return this.requestError(CodeTypes.UNKOWN_ERROR);
					});
			}
		},

		updateMany: {
			params: {
				minimum: "number",
				second: "string",
				third: "number"
			},
			handler(ctx) {
				return this.DB_Table1.updateMany(ctx, {
						third: { $gt: ctx.params.minimum } // $gt -> all entities with 'third' field greater than
					}, { // Cannot put 'first field' -> unique constraint
						second: ctx.params.second,
						third: ctx.params.third
					})
					//.then( (res) => res )
					.catch( (err) => {
						if (err.name === 'Database Error' && Array.isArray(err.data)){
							if (err.data[0].type === 'unique' && err.data[0].field === 'first')
								return this.requestError(CodeTypes.T1_FIRST_CONSTRAINT);
						}
						else if (err.name === 'Nothing Found')
							return this.requestError(CodeTypes.T1_NOTHING_FOUND);
						else
							return this.requestError(CodeTypes.UNKOWN_ERROR);
					});
			}
		},

		remove: {
			params: {
				id: "string"
			},
			handler(ctx) {
				return this.DB_Table1.removeById(ctx, ctx.params.id)
					//.then( (res) => res )
					.catch( (err) => {
						if (err.name === 'Nothing Found')
							return this.requestError(CodeTypes.T1_NOTHING_FOUND);
						else
							return this.requestError(CodeTypes.UNKOWN_ERROR);
					});
			}
		},

		removeByFirst: {
			params: {
				first: "string"
			},
			handler(ctx) {
				return this.DB_Table1.removeMany(ctx, {
						first: ctx.params.first
					})
					//.then( (res) => res )
					.catch( (err) => this.requestError(CodeTypes.UNKOWN_ERROR) );
			}
		},

		removeByThird: {
			params: {
				third: "string"
			},
			handler(ctx) {
				var third = parseInt(ctx.params.third);

				if (!isNaN(third))
					return this.DB_Table1.removeMany(ctx, {
							third: { $lt: ctx.params.third } // $lt -> all entities with 'third' field less than
						})
						//.then( (res) => res )
						.catch( (err) => this.requestError(CodeTypes.UNKOWN_ERROR) );
				else
					return this.requestError(CodeTypes.T1_THIRD_CONSTRAINT);
			}
		},

		removeAll: {
			params: {

			},
			handler(ctx) {
				return this.DB_Table1.removeAll(ctx)
					//.then( (res) => res )
					.catch( (err) => this.requestError(CodeTypes.UNKOWN_ERROR) );
			}
		}

	},

	methods: {

	},

	created() {
		this.DB_Table1 = new Database("Table1", Filters_T1.full);
	}
};
