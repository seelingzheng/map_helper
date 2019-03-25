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
      path: '*',
      redirect: '/'
    }
  ]
})