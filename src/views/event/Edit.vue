<template>
  <p>Edit the event here</p>
</template>

<script>
export default {
  props: ['id'],

  data() {
    return {
      unsavedChanges: true,
    }
  },

  beforeRouteLeave() {
    if (this.unsavedChanges) {
      let answer = window.confirm(
        'Do you really want to leave? You have unsaved changes.'
      )

      if (!answer) return false
    }
  },

  /* Same code in a different way
    beforeRouteLeave(routeTo, routeFrom, next) {
      if (this.unsavedChanges) {
        let answer = window.confirm(
          'Do you really want to leave? You have unsaved changes.'
        )

        if (answer) next()
        else next(false)
      } else {
        next()
      }
    },
  */
}
</script>
