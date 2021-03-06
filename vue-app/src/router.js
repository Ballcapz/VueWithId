import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      meta: {
        requiresAuth: true
      },
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  let app = router.app.$data || {isAuthenticated: false} ;
  if (app.isAuthenticated) {
    //already signed in, we can navigate anywhere
    next()
  } else if (to.matched.some(record => record.meta.requiresAuth)) {
    //authentication is required. Trigger the sign in process, including the return URI
    router.app.authenticate(to.path).then(() => {
      console.log('authenticating a protected url:' + to.path);
      next();
    });
  } else {
    //No auth required. We can navigate
    next()
  }
});

export default router;
