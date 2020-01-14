<template>
  <div class="bg-gray-800  h-screen overflow-y-hidden flex justify-center items-center text-white text-center">
      <div class="w-2/2">
        <h1 class="text-3xl">Error 404</h1>
        <h2 class="text-xl">Esta página no se ha podido encontrar <nuxt-link class="text-orange-300" to="/">volver a la página principal</nuxt-link></h2>
      </div>
  </div>
</template>

<script>
export default {
  props: ['error'],
  layout: 'default' // you can set a custom layout for the error page
}
</script>