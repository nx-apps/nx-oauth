import axios from '../axios'

const initialState = {
    list:[],
    select:{}
}

export function providerReducer(state = initialState,action){

    switch (action.type) {
        case 'PROVIDER_LIST':
            return Object.assign({},state,{list:action.payload});
        case 'PROVIDER_SELECT':
            return Object.assign({},state,{select:action.payload});
        case 'PROVIDER_CLEAR_SELECT':
            return Object.assign({},state,{select:{}});
        default:
            return state
    }

}

export function providerAction(store){

    return {
            PROVIDER_TEST:function(id){
                console.log(id);
            },
            PROVIDER_LIST:function(){
                var _this = pageProvider;
                axios.get('/providers')
                .then(res=>{
                    store.dispatch({type:'PROVIDER_LIST',payload:res.data})
                    _this.nylonVisible(true);
                })
                .catch(err=>{

                })
            },
            PROVIDER_SELECT:function(id){
                var _this = pageProvider;
                axios.get(`/providers/provider/${id}`)
                .then(res=>{
                    store.dispatch({type:'PROVIDER_SELECT',payload:res.data})
                    _this.$$('panel-right').open();
                })
                .catch(err=>{
                    console.log(err);
                })
            },
            PROVIDER_CLEAR_SELECT:function(){
                store.dispatch({type:'PROVIDER_CLEAR_SELECT'})
            },
            PROVIDER_INSERT:function(data){
                var _this = pageProvider;
                _this.fire('toast',{status:'load'});
                data.scope = data.scope.split(",");

                axios.post(`/providers/provider`,data)
                .then(res=>{
                    this.PROVIDER_LIST();
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
            PROVIDER_DELETE:function(id){
                var _this = pageProvider;
                _this.fire('toast',{status:'load'});

                axios.delete(`/providers/provider/${id}`)
                .then(res=>{
                    this.PROVIDER_LIST();
                    _this.fire('toast',{status:'success',text:'ลบข้อมูลสำเร็จ',
                        callback:()=>{
                            _this.$$('panel-right').close();
                        }
                    });
                })
                .catch(err=>{
                    console.log(err);
                })
            },
            PROVIDER_UPDATE:function(data){
                var _this = pageProvider;
                _this.fire('toast',{status:'load'});
                data.scope = data.scope.split(",");

                axios.put(`/providers/provider`,data)
                .then(res=>{
                    this.PROVIDER_LIST();
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