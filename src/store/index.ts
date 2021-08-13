import { createStore } from 'vuex'
import card from './card';
import msg from './msg';

export default createStore({
  modules: { card, msg }
})
