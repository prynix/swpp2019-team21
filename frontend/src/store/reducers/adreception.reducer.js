import * as actionTypes from '../actions/actionTypes';

const initialState = {
    submitted: false,
    is_participated: false,
    views: 0,
    unique_link: null,
    ad_link: null,
    byuser_list: []
};

export const adreception_reducer = (state = initialState, action = null) => {
    switch (action.type) {
        case actionTypes.POST_RECEPTION:
            return {
                ...state,
                submitted: true,
                is_participated: true,
                views: action.data.views,
                unique_link: action.data.unique_link
            };
        case actionTypes.GET_RECEPTION:
            return {
                ...state,
                submitted: true,
                is_participated: true,
                views: action.data.views,
                ad_link: action.data.ad_link
            };
        case actionTypes.GET_PARTICIPATED:
            return {
                ...state,
                unique_link: action.data.unique_link,
                views: action.data.views,
                is_participated: true
            };
        case actionTypes.GET_BYUSER:
            return {
                ...state,
                byuser_list: action.data
            };
        case actionTypes.NOT_PARTICIPATED:
            return {
                ...state,
                is_participated: false
            };
        default:
            break;
    }
    return state;
};
