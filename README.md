![Moleculer logo](http://moleculer.services/images/banner.png)

# moleculer-mysql-template

Moleculer template for creating a secure web api, with a remote MySQL database, and a default account management.

**This template is based on [moleculer](https://github.com/moleculerjs/moleculer), using:**
- [moleculer-web](https://github.com/moleculerjs/moleculer-web)
- [moleculer-db](https://github.com/moleculerjs/moleculer-db)
- [sequelize](https://github.com/sequelize/sequelize)
- [mysql2](https://github.com/sidorares/node-mysql2)
- [password-hash](https://github.com/davidwood/node-password-hash)
- [JSON Web Token](https://github.com/auth0/node-jsonwebtoken) (JWT)

# Description

**This adapter overwrites the one from moleculer-db:**
- So less functionalities
- But some are added (like multi-table management per service).

For now the actions are very limited, but when understanding the adapter, you can change it to add your own features.

**It is more an example of usage than a template, but you can :**
- Change as you want the tables' model
- Create your own services (just be sure to keep the configuration described in [Usage](https://github.com/AGenson/moleculer-mysql-template/wiki/Usage))
- Change API routes to your own purpose (*cf - [moleculer-web](https://github.com/moleculerjs/moleculer-web)* for more details)

**New**
- Securing the API with an authentification process (password / tokens)
- Create, manage or delete user accounts
- ADMIN priviledge management

---

# Features
- Remote MySQL connection
- Simple CRUD actions
- Fields filtering
- Multi-table management (one service can do operations on several tables of the database)
- Formatting answers from requests ( Responses / Errors )

**New Features**
- Authentification of http request
- Default user account management
- Securing of accounts with hashed password and tokens management

---

# Install
``` bash
# Clone repository
git clone https://github.com/AGenson/moleculer-mysql-template

# Install dependencies
npm install
```

---
---
# The following is to resume functionalities
## [-> See the detailed version here](https://github.com/AGenson/moleculer-mysql-template/wiki)
---
---

# Usage

## Configure database informations:
All the following configuration will be in this folder : **./src/fixtures/database_template/**
### Database Connection:
database.config.js
```js
module.exports = {
	host: "mysql.example.host",
	port: "3306", // Default for mysql => 3306
	database: "db_example",
	username: "db_user",
	password: "db_password"
}
```

### Database Schema Examples: models/
index.js
```js
const Table1Model = require("./Table1Model");
const Table2Model = require("./Table2Model");


module.exports = {
	Table1: Table1Model,
	Table2: Table2Model
};
```

Table1Model.js
```js
module.exports = {
	name: "table1_elt",
	define: {
		id: { // id must always exist
			type: Sequelize.UUID, // Uses uuidv4 by default (default value is recommended)
			primaryKey: true,
			defaultValue: Sequelize.UUIDV4
		},

		first: {
			type: Sequelize.STRING(255),
			allowNull: false,
			defaultValue: "Default"
		},

		...
	},
	options: {
		timestamps: false
	}
};
```

## Give service access to database
- Change Filters to your need
- And add the tables you want for your service
```js
"use strict";
const Database = require("../adapters/Database");

// Filters applied when searching for entities
// Elements correspond to the columns of the table
const Filters_T1 = {
	full: ["id", "first", "second", "third"]
};
const Filters_T2 = {
	full: ["id", "first", "second"]
};


module.exports = {
	name: "service",

	actions: { ... },

	created() {
		this.DB_Table1 = new Database("Table1", Filters_T1.full);
		this.DB_Table2 = new Database("Table2"); // Default: Filters_T2.full
	}

```

## Call action on wanted table
```js
getAll: {
	params: { },
	handler(ctx) {
		return this.DB_Table1.find(ctx)
	}
}
```

---

# Database Management Functions
Functions are all detailed [HERE](https://github.com/AGenson/moleculer-mysql-template/wiki/Functions)
## Constructor
| Property | Type             | Default      | Description                                      |
| :------: | :--------------: | :----------: | ------------------------------------------------ |
| `table`  | `String`         | **required** | Name of the wanted table (defined in ./src/fixtures/database_template/models/index.js) |
| `filter` | `Array.<String>` | all columns  | Default filter for search (columns of the table) |

## Operations
All operations on a table
* [***find***](https://github.com/AGenson/moleculer-mysql-template/wiki/find) : Find all entities by query, and filter the fileds of results
* [***findOne***](https://github.com/AGenson/moleculer-mysql-template/wiki/findOne) : Find only one entity by query, and filter the fileds of the result
* [***findById***](https://github.com/AGenson/moleculer-mysql-template/wiki/findById) : Find the entity with the given id, and filter the fileds of the result
* [***count***](https://github.com/AGenson/moleculer-mysql-template/wiki/count) : Count the entities found corresponding to the given querry
* [***insert***](https://github.com/AGenson/moleculer-mysql-template/wiki/insert) : Insert a new entity into the table of the database
* [***insertMany***](https://github.com/AGenson/moleculer-mysql-template/wiki/insertMany) : Insert several entities into the table of the database
* [***updateById***](https://github.com/AGenson/moleculer-mysql-template/wiki/updateById) : Update the entity with the given id
* [***updateMany***](https://github.com/AGenson/moleculer-mysql-template/wiki/updateMany) : Update all entity corresponding to the given query
* [***removeById***](https://github.com/AGenson/moleculer-mysql-template/wiki/removeById) : Remove the entity with the given id
* [***removeMany***](https://github.com/AGenson/moleculer-mysql-template/wiki/removeMany) : Remove several entities with the given query
* [***removeAll***](https://github.com/AGenson/moleculer-mysql-template/wiki/removeAll) : Remove all entities from the table

---

# Database Errors

## Errors handling
Each operation functions return the wanted information, with a **specific format** (name, message, data).

But they may encounters errors. And the error format is the same as for normal answers: **name, message(, data)**

Here's a little description of how they are handled.

See details [HERE](https://github.com/AGenson/moleculer-mysql-template/wiki/Errors-handling)

## Errors handling (from service)
The adapter will manage the format of the response, as described in functions or errors handling.

But you do not especially want your client to see all those formatted responses. So here is an implementation of what could be a modulable solution.

See details [HERE](https://github.com/AGenson/moleculer-mysql-template/wiki/Errors-handling-(from-service))

---

# User account & Priviledge Management
Detailed description of authentification processes and user account functions.

* [API Gateway](https://github.com/AGenson/moleculer-mysql-template/wiki/API-Gateway)
* [Auth Service](https://github.com/AGenson/moleculer-mysql-template/wiki/Auth-Service)
* [User Service](https://github.com/AGenson/moleculer-mysql-template/wiki/User-Service)
