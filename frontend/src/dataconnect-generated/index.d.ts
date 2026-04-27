import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Activity_Key {
  id: UUIDString;
  __typename?: 'Activity_Key';
}

export interface AddCommentToTripData {
  comment_insert: Comment_Key;
}

export interface AddCommentToTripVariables {
  tripId: UUIDString;
  content: string;
}

export interface Comment_Key {
  id: UUIDString;
  __typename?: 'Comment_Key';
}

export interface CreateNewTripData {
  trip_insert: Trip_Key;
}

export interface CreateNewTripVariables {
  title: string;
  startDate: DateString;
  endDate: DateString;
  isPublic: boolean;
  description?: string | null;
  coverPhotoUrl?: string | null;
}

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

export interface Like_Key {
  userId: UUIDString;
  tripId: UUIDString;
  __typename?: 'Like_Key';
}

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

export interface Location_Key {
  id: UUIDString;
  __typename?: 'Location_Key';
}

export interface Photo_Key {
  id: UUIDString;
  __typename?: 'Photo_Key';
}

export interface Trip_Key {
  id: UUIDString;
  __typename?: 'Trip_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface ListPublicTripsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPublicTripsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListPublicTripsData, undefined>;
  operationName: string;
}
export const listPublicTripsRef: ListPublicTripsRef;

export function listPublicTrips(options?: ExecuteQueryOptions): QueryPromise<ListPublicTripsData, undefined>;
export function listPublicTrips(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPublicTripsData, undefined>;

interface GetMyTripsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyTripsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyTripsData, undefined>;
  operationName: string;
}
export const getMyTripsRef: GetMyTripsRef;

export function getMyTrips(options?: ExecuteQueryOptions): QueryPromise<GetMyTripsData, undefined>;
export function getMyTrips(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyTripsData, undefined>;

interface CreateNewTripRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewTripVariables): MutationRef<CreateNewTripData, CreateNewTripVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateNewTripVariables): MutationRef<CreateNewTripData, CreateNewTripVariables>;
  operationName: string;
}
export const createNewTripRef: CreateNewTripRef;

export function createNewTrip(vars: CreateNewTripVariables): MutationPromise<CreateNewTripData, CreateNewTripVariables>;
export function createNewTrip(dc: DataConnect, vars: CreateNewTripVariables): MutationPromise<CreateNewTripData, CreateNewTripVariables>;

interface AddCommentToTripRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddCommentToTripVariables): MutationRef<AddCommentToTripData, AddCommentToTripVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddCommentToTripVariables): MutationRef<AddCommentToTripData, AddCommentToTripVariables>;
  operationName: string;
}
export const addCommentToTripRef: AddCommentToTripRef;

export function addCommentToTrip(vars: AddCommentToTripVariables): MutationPromise<AddCommentToTripData, AddCommentToTripVariables>;
export function addCommentToTrip(dc: DataConnect, vars: AddCommentToTripVariables): MutationPromise<AddCommentToTripData, AddCommentToTripVariables>;

