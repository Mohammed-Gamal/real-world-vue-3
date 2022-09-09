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
import { watchEffect } from 'vue'

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

  created() {
    watchEffect(() => {
      this.events = null

      EventService.getEvents(2, this.page)
        .then((response) => {
          this.events = response.data
          this.totalEvents = response.headers['x-total-count']
        })
        .catch((error) => {
          console.log(error)
        })
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
