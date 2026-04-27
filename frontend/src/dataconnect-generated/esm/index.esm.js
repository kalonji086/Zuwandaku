import { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'frontend',
  location: 'us-east4'
};
export const listPublicTripsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPublicTrips');
}
listPublicTripsRef.operationName = 'ListPublicTrips';

export function listPublicTrips(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listPublicTripsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getMyTripsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyTrips');
}
getMyTripsRef.operationName = 'GetMyTrips';

export function getMyTrips(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getMyTripsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const createNewTripRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewTrip', inputVars);
}
createNewTripRef.operationName = 'CreateNewTrip';

export function createNewTrip(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createNewTripRef(dcInstance, inputVars));
}

export const addCommentToTripRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddCommentToTrip', inputVars);
}
addCommentToTripRef.operationName = 'AddCommentToTrip';

export function addCommentToTrip(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(addCommentToTripRef(dcInstance, inputVars));
}

