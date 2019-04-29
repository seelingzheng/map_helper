import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'picker',
      component: require('@/components/PickerPoint').default
    },
    {
      path: '/3d',
      name: '3d',
      component: require('@/components/3d').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})