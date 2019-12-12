/* eslint-disable import/prefer-default-export */
import * as ActionTypes from './ActionTypes';

export const comments = (state = { errMess: null, comments: [] }, action) => {
  switch (action.type) {
    case ActionTypes.ADD_COMMENTS:
      return { ...state, errMess: null, comments: action.payload };

    case ActionTypes.ADD_COMMENT:
      action.payload.id = state.comments.length + 1;
      const nextComments = [...state.comments, action.payload];
      return { ...state, errMess: null, comments: nextComments };

    case ActionTypes.COMMENTS_FAILED:
      return { ...state, errMess: action.payload };

    default:
      return state;
  }
};
