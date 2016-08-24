/**
 * Reducer for clientIsps
 */
import * as Actions from './actions';

/**

clientIsps:
  clientIspId:
    clientIspId
    name

    locationTime:
      locationId:
        startDate
        endDate
        timeAggregation
        timeSeries
        hourly

    fixed:
      lastWeek
      lastMonth
      lastYear
      distribution
 */

const initialState = {
};

export const initialClientIspState = {
  locationTime: {},
};

export const initialLocationTimeState = {
  timeSeries: {
    isFetching: false,
    isFetched: false,
  },
  hourly: {
    isFetching: false,
    isFetched: false,
  },
};

// reducer for the time portion of a location+client ISP pairing
function locationTime(state = initialLocationTimeState, action = {}) {
  switch (action.type) {
    case Actions.FETCH_LOCATION_TIME_SERIES:
      return {
        ...state,
        timeSeries: {
          data: state.timeSeries.data,
          timeAggregation: action.timeAggregation,
          isFetching: true,
          isFetched: false,
        },
      };
    case Actions.FETCH_LOCATION_TIME_SERIES_SUCCESS:
      return {
        ...state,
        timeSeries: {
          data: action.result,
          timeAggregation: state.timeSeries.timeAggregation,
          isFetching: false,
          isFetched: true,
        },
      };
    case Actions.FETCH_LOCATION_TIME_SERIES_FAIL:
      return {
        ...state,
        timeSeries: {
          isFetching: false,
          isFetched: false,
          error: action.error,
        },
      };
    default:
      return state;
  }
}


// reducer for each clientIsp
function clientIsp(state = initialClientIspState, action = {}) {
  const { locationId } = action;
  switch (action.type) {
    case Actions.FETCH_LOCATION_TIME_SERIES:
    case Actions.FETCH_LOCATION_TIME_SERIES_SUCCESS:
    case Actions.FETCH_LOCATION_TIME_SERIES_FAIL:
      return {
        ...state,
        locationTime: {
          ...state.locationTime,
          [locationId]: locationTime(state.locationTime[locationId], action),
        },
      };
    default:
      return state;
  }
}

// The root reducer
function clientIsps(state = initialState, action = {}) {
  const { clientIspId } = action;
  switch (action.type) {
    case Actions.FETCH_LOCATION_TIME_SERIES:
    case Actions.FETCH_LOCATION_TIME_SERIES_SUCCESS:
    case Actions.FETCH_LOCATION_TIME_SERIES_FAIL:
      return {
        ...state,
        [clientIspId]: clientIsp(state[clientIspId], action),
      };
    default:
      return state;
  }
}


// Export the reducer
export default clientIsps;