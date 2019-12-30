<template>
  <div class="admin-post-page">
    <section class="update-form">            
      <admin-post-form :post="loadedPost" @submit="onSubmitted"></admin-post-form>            
    </section>
  </div>    
</template>

<script>
// import axios from 'axios'
import AdminPostForm from '@/components/Admin/AdminPostForm'
export default {
  layout: 'admin',
  middleware: ['check-auth', 'auth'],
  components: { AdminPostForm },
  asyncData (context) {
    // recuperamos los datos del post através de axios para poder suplir el contenido del post
    return context.app.$axios.$get(process.env.baseURL + '/posts/' + context.params.postId + '.json')
      .then(data => {        
        return {
          loadedPost: {...data, id: context.params.postId}
        }
      })
      .catch(e => context.error(e))   
  },  
  methods: {
    // apuntamos al 'actions' del store y enviamos el contenido a 'editpost'
    onSubmitted (editedPost) {
      this.$store.dispatch('editPost', editedPost).then(() => {
        this.$router.push("/admin");
      })
    }
  }
}
</script>

<style scoped>

.update-form {
  width: 90%;
  margin: 20px auto;
}
@media (min-width: 768px) {
  .update-form {
    width: 500px;
  }
}

</style>

