/* eslint-disable import/first */
import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import boot from './modules/boot'
import helpers from './helpers'
/* eslint-enable import/first */

window.WIKI = null
window.boot = boot

Vue.use(Vuetify)
Vue.use(helpers)

Vue.component('setup', () => import(/* webpackMode: "eager" */ './components/setup.vue'))

let bootstrap = () => {
  window.WIKI = new Vue({
    el: '#root',
    mixins: [helpers],
    vuetify: new Vuetify()
  })
}

window.boot.onDOMReady(bootstrap)
