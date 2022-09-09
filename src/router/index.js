import { createRouter, createWebHistory } from 'vue-router'
import EventList from '@/views/EventList.vue'
import EventLayout from '@/views/event/Layout.vue'
import EventDetails from '@/views/event/Details.vue'
import EventRegister from '@/views/event/Register.vue'
import EventEdit from '@/views/event/Edit.vue'
import AboutView from '@/views/AboutView.vue'
import NotFound from '@/views/NotFound.vue'
import NetworkError from '@/views/NetworkError.vue'
import NProgress from 'nprogress'
import EventService from '@/services/EventService.js'
import GStore from '@/store'

const routes = [
  {
    path: '/',
    name: 'EventList',
    component: EventList,
    props: (route) => ({ page: parseInt(route.query.page) || 1 }),
  },
  {
    path: '/events/:id',
    name: 'EventLayout',
    props: true,
    component: EventLayout,
    beforeEnter: (to) => {
      // fetch event (by id) and set local data
      EventService.getEvent(to.params.id)
        .then((response) => {
          GStore.event = response.data
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            return {
              name: '404Resource',
              params: { resource: 'event' },
            }
          } else {
            return { name: 'NetworKError' }
          }
        })
    },
    children: [
      {
        path: '',
        name: 'EventDetails',
        component: EventDetails,
      },
      {
        path: 'register',
        name: 'EventRegister',
        component: EventRegister,
      },
      {
        path: 'edit',
        name: 'EventEdit',
        component: EventEdit,
      },
    ],
  },
  {
    path: '/event/:afterEvent(.*)',
    redirect: (to) => ({ path: '/events/' + to.params.afterEvent }),

    /* fix for nested routes (Method #2)
      children: [
        { path: 'register', redirect: () => ({ name: 'EventRegister' }) },
        { path: 'edit', redirect: () => ({ name: 'EventEdit' }) },
      ],
    */
  },
  {
    path: '/about-us',
    name: 'about',
    component: AboutView,
    // alias: '/about' // Note: Not suitable for SEO
  },
  {
    path: '/about',
    redirect: { name: 'about' }, // Simple expression

    /* Complex expressions
      1. redirect: () => ({ name: 'about' })
      2. redirect: () => {
        return { name: 'about' }
      }
    */
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound,
  },
  {
    path: '/404/:resource',
    name: '404Resource',
    component: NotFound,
    props: true,
  },
  {
    path: '/network-error',
    name: 'NetworkError',
    component: NetworkError,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach(() => {
  NProgress.start()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
