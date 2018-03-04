# find
Find all entities by query, and filter the fileds of results

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `ctx` | `Object` | **required** | Will serve to call a service action: `ctx.call` |
| `search` | `Object` | - | Default filter for search (columns of the table) |

### `search` field details:
| Sub-Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `query` | `Object` | - | ex:  `{ username: "username", age: { $lt: 5 } }` |
| `filter` | `Array.<String>` | - | ex: `["id", "username"]` |
| `limit` | `Number` | - | ex: `10` |

### Return
**Type:** `Promise`
If entities were found :
```js
// res = list of entities found
Promise.resolve({
	name: "Operation Successful",
	message: `Search Complete: ${res.length} element(s) found`,
	data: res
})
```
Else (nothing found / an error occured) :
```js
// res = list of entities found
Promise.reject({ ... })
```
*cf - details about errors*
