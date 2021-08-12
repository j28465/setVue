import { createStore } from 'vuex'

export default createStore({
  state: {
    msgShow: true,
    msgTitle: ""
  },
  mutations: {
    msgClose(state){
      console.log("msgClose");
      state.msgShow = false;
    },
    msgOpen(state, payload){
      state.msgTitle = payload.title;
      state.msgShow = true;
    }
  }
})
