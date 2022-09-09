<template>
  <h1>Events For Good</h1>
  <div class="events">
    <EventCard v-for="event in events" :key="event.id" :event="event" />

    <div class="pagination">
      <router-link
        id="page-prev"
        :to="{ name: 'EventList', query: { page: page - 1 } }"
        rel="prev"
        v-if="page != 1"
      >
        &lt; Previous
      </router-link>

      <router-link
        id="page-next"
        :to="{ name: 'EventList', query: { page: page + 1 } }"
        rel="next"
        v-if="hasNextPage"
      >
        Next &gt;
      </router-link>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import EventCard from '@/components/EventCard.vue'
import EventService from '@/services/EventService.js'
import NProgress from 'nprogress'

export default {
  name: 'EventList',

  props: ['page'],

  components: {
    EventCard,
  },

  data() {
    return {
      events: null,
      totalEvents: 0,
    }
  },

  beforeRouteEnter(routeTo, routeFrom, next) {
    NProgress.start()

    EventService.getEvents(2, parseInt(routeTo.query.page) || 1)
      .then((response) => {
        // when component is loaded
        next((comp) => {
          comp.events = response.data
          comp.totalEvents = response.headers['x-total-count']
        })
      })
      .catch(() => {
        next({ name: 'NetworkError' })
      })
      .finally(() => {
        NProgress.done()
      })
  },

  beforeRouteUpdate(routeTo) {
    NProgress.start()

    EventService.getEvents(2, parseInt(routeTo.query.page) || 1)
      .then((response) => {
        this.events = response.data
        this.totalEvents = response.headers['x-total-count']
      })
      .catch(() => {
        return { name: 'NetworkError' }
      })
      .finally(() => {
        NProgress.done()
      })
  },

  computed: {
    hasNextPage() {
      // 6 (total events) divided by 2 (events per page) = 3 (pages)
      let totalPages = Math.ceil(this.totalEvents / 2)

      return this.page < totalPages
    },
  },
}
</script>

<style lang="scss" scoped>
.events {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.pagination {
  display: flex;
  width: 300px;

  a {
    flex: 1;
    color: #2c3e50;
    text-decoration: none;

    &#page-prev {
      text-align: left;
    }

    &#page-next {
      text-align: right;
    }
  }
}
</style>
