import {FORM_SAVING_LOADING} from "../constants";

export function setLoader(val) {
    return {
        type: FORM_SAVING_LOADING,
        val : val
    };
}