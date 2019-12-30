<template>
    <div class="admin-page">
        <section class="new-post">
            <!-- evento click q redirige a pagina newpost -->
            <AppButton @click="$router.push('/admin/new-post/')">Creat Post</AppButton>
            <AppButton style="margin-left: 10px" @click="onLogout">Logout</AppButton>
        </section>
        <section class="existing-posts">
            <h1>Existing Posts</h1>
            <post-list isAdmin :posts="loadedPosts" ></post-list>
        </section>
    </div>
</template>

<script>
export default {
  layout: 'admin',
  middleware: ['check-auth', 'auth'],
  computed: {
    loadedPosts () {
      // refencio el getter almacenado en el Store par hacer uso de la API REST
      return this.$store.getters.loadedPosts
    }
  },
  methods: {
    onLogout () {
      this.$store.dispatch('logout')
      this.$router.push('/admin/auth')
    }

  } 

}
</script>

<style scoped>

.admin-page {
  padding: 20px;
}

.new-post {
  text-align: center;
  border-bottom: 2px solid #ccc;
  padding-bottom: 10px;
}

.existing-posts h1 {
  text-align: center;
}

</style>
