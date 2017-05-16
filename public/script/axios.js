import {create} from 'axios'
import {baseURL} from './config'
import Cookies from 'js-cookie'

export default create({
    baseURL:baseURL+'/api'
    // ,
    // headers: {
    //    // 'Authorization': 'JWT '+ Cookies.get('jwt'),
    //     'x-app-id':Cookies.get('x_app_id'),
    //     'x-app-key':Cookies.get('x_app_key')
    // }
});