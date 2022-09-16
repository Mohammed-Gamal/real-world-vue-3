<template>
  <h1>Events for Good</h1>
  <div class="events">
    <EventCard v-for="event in events" :key="event.id" :event="event" />
    <div class="nav-links">
      <router-link
        id="page-prev"
        :to="{ name: 'EventList', query: { page: page - 1 } }"
        rel="prev"
        v-if="page != 1"
      >
        &#60; Previous
      </router-link>
      <router-link
        id="page-next"
        :to="{ name: 'EventList', query: { page: page + 1 } }"
        rel="next"
        v-if="hasNextPage"
      >
        Next &#62;
      </router-link>
    </div>
  </div>
</template>

<script>
import EventCard from '@/components/EventCard.vue'
export default {
  name: 'EventList',
  components: {
    EventCard,
  },
  created() {
    this.$store
      .dispatch('fetchEvents', { perPage: 3, page: this.page })
      .catch((error) => {
        this.$router.push({
          name: 'ErrorDisplay',
          params: { error: error },
        })
      })
  },
  computed: {
    page() {
      return parseInt(this.$route.query.page) || 1
    },
    events() {
      return this.$store.state.events
    },
    hasNextPage() {
      return this.page < Math.ceil(this.$store.state.totalEvents / 3)
    },
  },
}
</script>

<style scoped>
.events {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.nav-links {
  min-width: 300px;
  display: flex;
  justify-content: space-between;
}

.nav-links a {
  flex: 1;
}

.nav-links #page-prev {
  text-align: left;
}

.nav-links #page-next {
  text-align: right;
}
</style>
