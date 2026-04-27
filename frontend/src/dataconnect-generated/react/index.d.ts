import { ListPublicTripsData, GetMyTripsData, CreateNewTripData, CreateNewTripVariables, AddCommentToTripData, AddCommentToTripVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useListPublicTrips(options?: useDataConnectQueryOptions<ListPublicTripsData>): UseDataConnectQueryResult<ListPublicTripsData, undefined>;
export function useListPublicTrips(dc: DataConnect, options?: useDataConnectQueryOptions<ListPublicTripsData>): UseDataConnectQueryResult<ListPublicTripsData, undefined>;

export function useGetMyTrips(options?: useDataConnectQueryOptions<GetMyTripsData>): UseDataConnectQueryResult<GetMyTripsData, undefined>;
export function useGetMyTrips(dc: DataConnect, options?: useDataConnectQueryOptions<GetMyTripsData>): UseDataConnectQueryResult<GetMyTripsData, undefined>;

export function useCreateNewTrip(options?: useDataConnectMutationOptions<CreateNewTripData, FirebaseError, CreateNewTripVariables>): UseDataConnectMutationResult<CreateNewTripData, CreateNewTripVariables>;
export function useCreateNewTrip(dc: DataConnect, options?: useDataConnectMutationOptions<CreateNewTripData, FirebaseError, CreateNewTripVariables>): UseDataConnectMutationResult<CreateNewTripData, CreateNewTripVariables>;

export function useAddCommentToTrip(options?: useDataConnectMutationOptions<AddCommentToTripData, FirebaseError, AddCommentToTripVariables>): UseDataConnectMutationResult<AddCommentToTripData, AddCommentToTripVariables>;
export function useAddCommentToTrip(dc: DataConnect, options?: useDataConnectMutationOptions<AddCommentToTripData, FirebaseError, AddCommentToTripVariables>): UseDataConnectMutationResult<AddCommentToTripData, AddCommentToTripVariables>;
