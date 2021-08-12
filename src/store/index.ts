import { createStore } from 'vuex'
import msg from './msg';

export default createStore({
  state: {
    msgShow: false,
    msgTitle: ""
  },
  mutations: {
    msgClose(state){
      console.log("indexClose");
      state.msgShow = false;
    },
    msgOpen(state, payload){
      state.msgTitle = payload.title;
      state.msgShow = true;
    }
  },
  actions: {
  },
  modules: {
    msg: msg
  }
})
