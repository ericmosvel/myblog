<template>
  <div class="posts-page">
    <PostList :posts="loadedPosts" />
  </div>
</template>

<script>
//import PostList from '@/components/Posts/PostList'

export default {
  computed: {
    loadedPosts () {
      // refencio el getter almacenado en el Store par hacer uso de la API REST  
      return this.$store.getters.loadedPosts
    }
  }
};
</script>


<style scoped>
.posts-page {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>