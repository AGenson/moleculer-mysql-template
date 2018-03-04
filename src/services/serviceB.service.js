"use strict";

const Database = require("../adapters/Database");
const Request = require("../mixins/request.mixin");
const CodeTypes = require("../fixtures/error.codes");

// Filters applied when searching for entities
// Elements correspond to the columns of wanted table
const Filters_T1 = {
	full: ["id", "first", "second", "third"],
	two: ["id", "first", "second"],
	one: ["id", "first"],
	id: ["id"]
};
const Filters_T2 = {
	full: ["id", "first", "second"],
	simple: ["first", "second"],
	id: ["id"]
};



module.exports = {
	name: "serviceB",

	mixins: [ Request ],

	actions: {

		create: {
			params: {
				first: "string",
				second: { type: "number", optional: true } // Means that the value can be 'null'
			},
			handler(ctx) {
				return this.DB_Table2.insert(ctx, {
						first: ctx.params.first,
						second: ctx.params.second
					})
					//.then( (res) => res )
					.catch( (err) => this.requestError(CodeTypes.UNKOWN_ERROR) );
			} // A 'notNull' error can also occur if a field is defined by 'allowNull: false'
		},

		createMany: {
			params: {
				entities: { type: "array", optional: false, items: "object" }
			},
			handler(ctx) {
				return this.DB_Table2.insertMany(ctx, ctx.params.entities)
					//.then( (res) => res )
					.catch( (err) => this.requestError(CodeTypes.UNKOWN_ERROR) );
			} // A 'notNull' error can also occur if a field is defined by 'allowNull: false'
		},

		getAll: {
			params: {

			},
			handler(ctx) {
				return this.DB_Table2.find(ctx)
					//.then( (res) => res )
					.catch( (err) => {
						if (err.name === 'Nothing Found')
							return this.requestError(CodeTypes.T2_NOTHING_FOUND);
						else
							return this.requestError(CodeTypes.UNKOWN_ERROR);
					});
			}
		},

		getAllIds: {
			params: {

			},
			handler(ctx) {
				return this.DB_Table2.find(ctx, {
						//query: { },
						filter: Filters_T2.id
					})
					.then( (res) => {
						var result = res;

						result.data = res.data.map( (item) => item.id );

						return res;
					})
					.catch( (err) => {
						if (err.name === 'Nothing Found')
							return this.requestError(CodeTypes.T2_NOTHING_FOUND);
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
				return this.DB_Table2.findOne(ctx, {
						query: {
							first: ctx.params.first
						},
						//filter: Filters_T2.full
					})
					//.then( (res) => res )
					.catch( (err) => {
						if (err.name === 'Nothing Found')
							return this.requestError(CodeTypes.T2_NOTHING_FOUND);
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
				return this.DB_Table2.findById(ctx, {
						id: ctx.params.id,
						//filter: Filters_T2.full
					})
					//.then( (res) => res )
					.catch( (err) => {
						if (err.name === 'Nothing Found')
							return this.requestError(CodeTypes.T2_NOTHING_FOUND);
						else
							return this.requestError(CodeTypes.UNKOWN_ERROR);
					});
			}
		},

		getAll_1_2: {
			params: {

			},
			handler(ctx) {
				var first_search = {};

				return this.Promise.all( [ this.DB_Table1.find(ctx), this.DB_Table2.find(ctx)] )
					.then( (res) => {
						var result = res;

						result[0].message += " in Table1";
						result[1].message += " in Table2";

						return result;
					})
					.catch( (err) => {
						if (err.name === 'Nothing Found')
							return this.requestError(CodeTypes.T1_T2_NOTHING_FOUND);
						else
							return this.requestError(CodeTypes.UNKOWN_ERROR);
					});
			}
		},

		count: {
			params: {

			},
			handler(ctx) {
				return this.DB_Table2.count(ctx, { })
					//.then( (res) => res )
					.catch( (err) => this.requestError(CodeTypes.UNKOWN_ERROR) );
			}
		},

		update: {
			params: {
				id: "string",
				first: "string",
				second: { type: "number", optional: true } // Means that the value can be 'null'
			},
			handler(ctx) {
				return this.DB_Table2.updateById(ctx, ctx.params.id, {
						first: ctx.params.first,
						second: ctx.params.second
					})
					//.then( (res) => res )
					.catch( (err) => {
						if (err.name === 'Nothing Found')
							return this.requestError(CodeTypes.T2_NOTHING_FOUND);
						else
							return this.requestError(CodeTypes.UNKOWN_ERROR);
					});
			}
		},

		updateMany: {
			params: {
				minimum: "number",
				second: { type: "number", optional: true } // Means that the value can be 'null'
			},
			handler(ctx) {
				return this.DB_Table2.updateMany(ctx, {
						second: { $gt: ctx.params.minimum } // $gt -> all entities with 'third' field greater than
					}, {
						second: ctx.params.second
					})
					//.then( (res) => res )
					.catch( (err) => {
						if (err.name === 'Nothing Found')
							return this.requestError(CodeTypes.T2_NOTHING_FOUND);
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
				return this.DB_Table2.removeById(ctx, ctx.params.id)
					//.then( (res) => res )
					.catch( (err) => {
						if (err.name === 'Nothing Found')
							return this.requestError(CodeTypes.T2_NOTHING_FOUND);
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
				return this.DB_Table2.removeMany(ctx, {
						first: ctx.params.first
					})
					//.then( (res) => res )
					.catch( (err) => this.requestError(CodeTypes.UNKOWN_ERROR) );
			}
		},

		removeBySecond: {
			params: {
				second: "string" // This time, 'second' is required not null
			},
			handler(ctx) {
				var second = parseInt(ctx.params.second);

				if (!isNaN(second))
					return this.DB_Table2.removeMany(ctx, {
							second: { $lt: ctx.params.second } // $lt -> all entities with 'second' field less than
						})
						//.then( (res) => res )
						.catch( (err) => this.requestError(CodeTypes.UNKOWN_ERROR) );
				else
					return this.requestError(CodeTypes.T1_SECOND_CONSTRAINT);
			}
		},

		removeAll: {
			params: {

			},
			handler(ctx) {
				return this.DB_Table2.removeAll(ctx)
					//.then( (res) => res )
					.catch( (err) => this.requestError(CodeTypes.UNKOWN_ERROR) );
			}
		}
	},

	methods: {

	},

	created() {
		this.DB_Table1 = new Database("Table1", Filters_T1.two);
		this.DB_Table2 = new Database("Table2"); // Default: Filters_T2.full
	}
};
