import {create} from 'axios'
import {baseURL} from './config'
import Cookies from 'js-cookie'

window.baseURL = baseURL+'/api';
export default create({
    baseURL:window.baseURL
    ,
    headers: {
        'Authorization': 'JWT '+ Cookies.get('JWT'),
        'X-CLIENT-ID':Cookies.get('X-CLIENT-ID'),
        'X-CLIENT-KEY':Cookies.get('X-CLIENT-KEY')
    }
});