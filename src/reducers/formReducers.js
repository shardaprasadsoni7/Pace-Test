import {FORM_SAVING_LOADING} from "../constants";

const initialState = {
    loading: false,
};

export default function formReducer(state = initialState, action) {
    switch (action.type) {

        case FORM_SAVING_LOADING: {
            return {
                ...state, loading: action.val
            }
        }
        default:
            return state;
    }
}