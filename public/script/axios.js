import {create} from 'axios'
import {baseURL} from './config'
import Cookies from 'js-cookie'

window.baseURL = baseURL+'/api';
export default create({
    baseURL:window.baseURL
    // ,
    // headers: {
    //    // 'Authorization': 'JWT '+ Cookies.get('jwt'),
    //     'x-app-id':Cookies.get('x_app_id'),
    //     'x-app-key':Cookies.get('x_app_key')
    // }
});