import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    list:[],
    select:{}
}

export function userReducer(state = initialState,action){

    switch (action.type) {
        case 'USER_LIST':
            return Object.assign({},state,{list:action.payload});
        case 'USER_SELECT':
            return Object.assign({},state,{select:action.payload});
        case 'USER_CLEAR_SELECT':
            return Object.assign({},state,{select:{}});
        default:
            return state
    }

}

export function userAction(store){

    return [commonAction(),
        {
            USER_TEST:function(id){
                console.log(id);
            },
            USER_LIST:function(){
                axios.get('/users/info')
                .then(res=>{
                    store.dispatch({type:'USER_LIST',payload:res.data})
                    this.nylonVisible(true);
                })
                .catch(err=>{

                })
            },
            USER_SELECT:function(id){
                axios.get(`/users/info/${id}`)
                .then(res=>{
                    store.dispatch({type:'USER_SELECT',payload:res.data})
                    this.$$('panel-right').open();
                })
                .catch(err=>{
                    console.log(err);
                })
            },
            USER_CLEAR_SELECT:function(){
                store.dispatch({type:'USER_CLEAR_SELECT'})
            },
            USER_INSERT:function(data){

                this.fire('toast',{status:'load'});
               // data.scope = data.scope.split(",");

                axios.post(`/users/user`,data)
                .then(res=>{
                    this.USER_LIST();
                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                        callback:()=>{
                            this.$$('panel-right').close();
                        }
                    });
                })
                .catch(err=>{
                    console.log(err);
                })

            },
            USER_DELETE:function(id){
                
                this.fire('toast',{status:'load'});

                axios.delete(`/users/user/${id}`)
                .then(res=>{
                    this.USER_LIST();
                    this.fire('toast',{status:'success',text:'ลบข้อมูลสำเร็จ',
                        callback:()=>{
                            this.$$('panel-right').close();
                        }
                    });
                })
                .catch(err=>{
                    console.log(err);
                })
            },
            USER_UPDATE:function(data){
                this.fire('toast',{status:'load'});
                //data.scope = data.scope.split(",");

                axios.put(`/users/user`,data)
                .then(res=>{
                    this.USER_LIST();
                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                        callback:()=>{
                            this.$$('panel-right').close();
                        }
                    });
                })
                .catch(err=>{
                    console.log(err);
                })
            }
        }
    ]

}