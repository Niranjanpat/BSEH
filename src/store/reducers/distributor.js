import {distributorAction} from '../action_types';

const initialStore = {
  distributorVisitStatus: {},
  checkVisitLoading: false,
};

const distributorReducer = (state = initialStore, action) => {
  const {type, payload} = action;

  switch (type) {
    case distributorAction.STORE_DISTRIBUTOR_VISIT_STATUS:
      return {...state, distributorVisitStatus: payload};

    case distributorAction.STORE_CHECK_VISIT_LOADING:
      return {...state, checkVisitLoading: payload};

    default:
      return state;
  }
};

export default distributorReducer;
