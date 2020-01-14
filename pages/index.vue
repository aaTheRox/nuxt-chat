<template>
<div class="bg-gray-800 h-screen overflow-y-hidden flex justify-center items-center text-white">
  
  <div class="w-2/5 sm:px-5">
<!--   <h1 class="text-1 text-center uppercase  mb-3">
    Usuarios conectados
  </h1>
  {{ NO_DATA }}
  -->
  
<div class="text-center w-full">


  <button @click="$router.push('/login')" class="py-3 px-3 mt-4 w-full bg-red-500 rounded w-full block">Iniciar sesión</button>
</div>
  </div>
</div>
</template>

<script>

export default {
  components: {
  }
}
</script>

<style>

</style>
