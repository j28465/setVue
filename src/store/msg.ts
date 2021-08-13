export default {
  namespace: true,
  state: {
    msgShow: false,
    msgTitle: ""
  },
  mutations: {
    closeMsg(state: { msgShow: boolean; }){
      state.msgShow = false;
    },
    openMsg(state: { msgTitle: string; msgShow: boolean; }, payload: { title: string; }){
      state.msgTitle = payload.title;
      state.msgShow = true;
    }
  }
}