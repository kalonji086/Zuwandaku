# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListPublicTrips*](#listpublictrips)
  - [*GetMyTrips*](#getmytrips)
- [**Mutations**](#mutations)
  - [*CreateNewTrip*](#createnewtrip)
  - [*AddCommentToTrip*](#addcommenttotrip)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListPublicTrips
You can execute the `ListPublicTrips` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listPublicTrips(options?: ExecuteQueryOptions): QueryPromise<ListPublicTripsData, undefined>;

interface ListPublicTripsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPublicTripsData, undefined>;
}
export const listPublicTripsRef: ListPublicTripsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPublicTrips(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPublicTripsData, undefined>;

interface ListPublicTripsRef {
  ...
  (dc: DataConnect): QueryRef<ListPublicTripsData, undefined>;
}
export const listPublicTripsRef: ListPublicTripsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPublicTripsRef:
```typescript
const name = listPublicTripsRef.operationName;
console.log(name);
```

### Variables
The `ListPublicTrips` query has no variables.
### Return Type
Recall that executing the `ListPublicTrips` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPublicTripsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListPublicTripsData {
  trips: ({
    id: UUIDString;
    title: string;
    startDate: DateString;
    endDate: DateString;
    coverPhotoUrl?: string | null;
    user?: {
      displayName: string;
    };
  } & Trip_Key)[];
}
```
### Using `ListPublicTrips`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPublicTrips } from '@dataconnect/generated';


// Call the `listPublicTrips()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPublicTrips();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPublicTrips(dataConnect);

console.log(data.trips);

// Or, you can use the `Promise` API.
listPublicTrips().then((response) => {
  const data = response.data;
  console.log(data.trips);
});
```

### Using `ListPublicTrips`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPublicTripsRef } from '@dataconnect/generated';


// Call the `listPublicTripsRef()` function to get a reference to the query.
const ref = listPublicTripsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPublicTripsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.trips);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.trips);
});
```

## GetMyTrips
You can execute the `GetMyTrips` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMyTrips(options?: ExecuteQueryOptions): QueryPromise<GetMyTripsData, undefined>;

interface GetMyTripsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyTripsData, undefined>;
}
export const getMyTripsRef: GetMyTripsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyTrips(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyTripsData, undefined>;

interface GetMyTripsRef {
  ...
  (dc: DataConnect): QueryRef<GetMyTripsData, undefined>;
}
export const getMyTripsRef: GetMyTripsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyTripsRef:
```typescript
const name = getMyTripsRef.operationName;
console.log(name);
```

### Variables
The `GetMyTrips` query has no variables.
### Return Type
Recall that executing the `GetMyTrips` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyTripsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMyTripsData {
  trips: ({
    id: UUIDString;
    title: string;
    startDate: DateString;
    endDate: DateString;
    description?: string | null;
    isPublic: boolean;
    coverPhotoUrl?: string | null;
  } & Trip_Key)[];
}
```
### Using `GetMyTrips`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyTrips } from '@dataconnect/generated';


// Call the `getMyTrips()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyTrips();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyTrips(dataConnect);

console.log(data.trips);

// Or, you can use the `Promise` API.
getMyTrips().then((response) => {
  const data = response.data;
  console.log(data.trips);
});
```

### Using `GetMyTrips`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyTripsRef } from '@dataconnect/generated';


// Call the `getMyTripsRef()` function to get a reference to the query.
const ref = getMyTripsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyTripsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.trips);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.trips);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateNewTrip
You can execute the `CreateNewTrip` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createNewTrip(vars: CreateNewTripVariables): MutationPromise<CreateNewTripData, CreateNewTripVariables>;

interface CreateNewTripRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewTripVariables): MutationRef<CreateNewTripData, CreateNewTripVariables>;
}
export const createNewTripRef: CreateNewTripRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createNewTrip(dc: DataConnect, vars: CreateNewTripVariables): MutationPromise<CreateNewTripData, CreateNewTripVariables>;

interface CreateNewTripRef {
  ...
  (dc: DataConnect, vars: CreateNewTripVariables): MutationRef<CreateNewTripData, CreateNewTripVariables>;
}
export const createNewTripRef: CreateNewTripRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createNewTripRef:
```typescript
const name = createNewTripRef.operationName;
console.log(name);
```

### Variables
The `CreateNewTrip` mutation requires an argument of type `CreateNewTripVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateNewTripVariables {
  title: string;
  startDate: DateString;
  endDate: DateString;
  isPublic: boolean;
  description?: string | null;
  coverPhotoUrl?: string | null;
}
```
### Return Type
Recall that executing the `CreateNewTrip` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateNewTripData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateNewTripData {
  trip_insert: Trip_Key;
}
```
### Using `CreateNewTrip`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createNewTrip, CreateNewTripVariables } from '@dataconnect/generated';

// The `CreateNewTrip` mutation requires an argument of type `CreateNewTripVariables`:
const createNewTripVars: CreateNewTripVariables = {
  title: ..., 
  startDate: ..., 
  endDate: ..., 
  isPublic: ..., 
  description: ..., // optional
  coverPhotoUrl: ..., // optional
};

// Call the `createNewTrip()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createNewTrip(createNewTripVars);
// Variables can be defined inline as well.
const { data } = await createNewTrip({ title: ..., startDate: ..., endDate: ..., isPublic: ..., description: ..., coverPhotoUrl: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createNewTrip(dataConnect, createNewTripVars);

console.log(data.trip_insert);

// Or, you can use the `Promise` API.
createNewTrip(createNewTripVars).then((response) => {
  const data = response.data;
  console.log(data.trip_insert);
});
```

### Using `CreateNewTrip`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createNewTripRef, CreateNewTripVariables } from '@dataconnect/generated';

// The `CreateNewTrip` mutation requires an argument of type `CreateNewTripVariables`:
const createNewTripVars: CreateNewTripVariables = {
  title: ..., 
  startDate: ..., 
  endDate: ..., 
  isPublic: ..., 
  description: ..., // optional
  coverPhotoUrl: ..., // optional
};

// Call the `createNewTripRef()` function to get a reference to the mutation.
const ref = createNewTripRef(createNewTripVars);
// Variables can be defined inline as well.
const ref = createNewTripRef({ title: ..., startDate: ..., endDate: ..., isPublic: ..., description: ..., coverPhotoUrl: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createNewTripRef(dataConnect, createNewTripVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.trip_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.trip_insert);
});
```

## AddCommentToTrip
You can execute the `AddCommentToTrip` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addCommentToTrip(vars: AddCommentToTripVariables): MutationPromise<AddCommentToTripData, AddCommentToTripVariables>;

interface AddCommentToTripRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddCommentToTripVariables): MutationRef<AddCommentToTripData, AddCommentToTripVariables>;
}
export const addCommentToTripRef: AddCommentToTripRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addCommentToTrip(dc: DataConnect, vars: AddCommentToTripVariables): MutationPromise<AddCommentToTripData, AddCommentToTripVariables>;

interface AddCommentToTripRef {
  ...
  (dc: DataConnect, vars: AddCommentToTripVariables): MutationRef<AddCommentToTripData, AddCommentToTripVariables>;
}
export const addCommentToTripRef: AddCommentToTripRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addCommentToTripRef:
```typescript
const name = addCommentToTripRef.operationName;
console.log(name);
```

### Variables
The `AddCommentToTrip` mutation requires an argument of type `AddCommentToTripVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddCommentToTripVariables {
  tripId: UUIDString;
  content: string;
}
```
### Return Type
Recall that executing the `AddCommentToTrip` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddCommentToTripData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddCommentToTripData {
  comment_insert: Comment_Key;
}
```
### Using `AddCommentToTrip`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addCommentToTrip, AddCommentToTripVariables } from '@dataconnect/generated';

// The `AddCommentToTrip` mutation requires an argument of type `AddCommentToTripVariables`:
const addCommentToTripVars: AddCommentToTripVariables = {
  tripId: ..., 
  content: ..., 
};

// Call the `addCommentToTrip()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addCommentToTrip(addCommentToTripVars);
// Variables can be defined inline as well.
const { data } = await addCommentToTrip({ tripId: ..., content: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addCommentToTrip(dataConnect, addCommentToTripVars);

console.log(data.comment_insert);

// Or, you can use the `Promise` API.
addCommentToTrip(addCommentToTripVars).then((response) => {
  const data = response.data;
  console.log(data.comment_insert);
});
```

### Using `AddCommentToTrip`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addCommentToTripRef, AddCommentToTripVariables } from '@dataconnect/generated';

// The `AddCommentToTrip` mutation requires an argument of type `AddCommentToTripVariables`:
const addCommentToTripVars: AddCommentToTripVariables = {
  tripId: ..., 
  content: ..., 
};

// Call the `addCommentToTripRef()` function to get a reference to the mutation.
const ref = addCommentToTripRef(addCommentToTripVars);
// Variables can be defined inline as well.
const ref = addCommentToTripRef({ tripId: ..., content: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addCommentToTripRef(dataConnect, addCommentToTripVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.comment_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.comment_insert);
});
```

