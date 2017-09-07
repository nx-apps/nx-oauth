import axios from '../axios'
import async from 'async'

const initialState = {}

export function imageReducer(state = initialState,action){

    switch (action.type) {
        case 'APP_LIST':
            return state
        default:
            return state
    }

}

export function imageAction(store){

    return {

            UPLOAD_IMAGE:function(files){
                var data = new FormData();
                data.append('file', files[0]);
                return axios.post('./image/image', data);
            }
        }

}