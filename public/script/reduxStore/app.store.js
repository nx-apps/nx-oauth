import axios from '../axios'
import async from 'async'

const initialState = {
    list:[],
    select:{},
    providerList:[]
}

export function appReducer(state = initialState,action){

    switch (action.type) {
        case 'APP_LIST':
            return Object.assign({},state,{list:action.payload});
        case 'APP_SELECT':
            return Object.assign({},state,{select:action.payload});
        case 'APP_CLEAR_SELECT':
            return Object.assign({},state,{select:{}});
        case 'APP_PROVIDER_LIST':
            return Object.assign({},state,{providerList:action.payload});
        default:
            return state
    }

}

export function appAction(store){

    return {

            APP_PROVIDER_LIST:function(){
                axios.get('/providers')
                .then(res=>{
                    store.dispatch({type:'APP_PROVIDER_LIST',payload:res.data})
                })
                .catch(err=>{

                })
            },
            APP_LIST:function(){
                axios.get('/apps')
                .then(res=>{
                    store.dispatch({type:'APP_LIST',payload:res.data})
                    this.nylonVisible(true);
                })
                .catch(err=>{

                })
            },
            APP_SELECT:function(id){
                var _this = pageMyApp;
                axios.get(`/apps/app/${id}`)
                .then(res=>{
                    store.dispatch({type:'APP_SELECT',payload:res.data})
                    _this.$$('panel-right').open();
                })
                .catch(err=>{
                    console.log(err);
                })
            },
            APP_CLEAR_SELECT:function(){
                // var providerList = store.getState().app.providerList;
                // async.map(providerList ,function(row, callback){
                //     callback(null, {id:row.id,provider_name:row.provider_name,checked:false});
                // } ,function (err, result) {
                //     store.dispatch({type:'APP_CLEAR_SELECT',payload:{provider:result}})
                // });
                store.dispatch({type:'APP_CLEAR_SELECT'})
            },
            APP_INSERT:function(data){
                var _this = pageMyApp;
                _this.fire('toast',{status:'load'});

                axios.post(`/apps/app`,data)
                .then(res=>{
                    this.APP_LIST();
                    _this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                        callback:()=>{
                            _this.$$('panel-right').close();
                        }
                    });
                })
                .catch(err=>{
                    console.log(err);
                })

            },
            APP_DELETE:function(id){
                //  store.getState().myApp.MY_APP_LIST();
                var _this = pageMyApp;
                _this.fire('toast',{status:'load'});
                axios.delete(`/apps/app/${id}`)
                .then(res=>{
                   
                    
                    _this.fire('toast',{status:'success',text:'ลบข้อมูลสำเร็จ',
                        callback:()=>{
                            this.MY_APP_LIST();
                            _this.$$('panel-right').close();
                        }
                    });
                })
                .catch(err=>{
                    console.log(err);
                })
            },
            APP_UPDATE:function(data){
                //console.log(data);
                var _this = pageMyApp;

                _this.fire('toast',{status:'load'});

                axios.put(`/apps/app`,data)
                .then(res=>{
                    this.APP_LIST();
                    _this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                        callback:()=>{
                            _this.$$('panel-right').close();
                        }
                    });
                })
                .catch(err=>{
                    console.log(err);
                })
            }
        }

}