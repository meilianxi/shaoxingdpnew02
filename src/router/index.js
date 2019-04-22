import Vue from 'vue'
import Router from 'vue-router'
import overview from '@/views/overview'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'overview',
      component: overview
    }
  ]
})
