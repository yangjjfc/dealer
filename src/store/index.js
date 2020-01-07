import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters.js';
Vue.use(Vuex);
const store = new Vuex.Store({
    modules: {
    },
    getters
});

export default store;