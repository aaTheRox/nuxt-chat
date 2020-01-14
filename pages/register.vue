<template>
<div class="bg-gray-800 h-screen overflow-y-hidden flex justify-center items-center">
  
  <div class="md:w-2/5 sm:px-5">
  

  <h1 class="text-3xl text-center uppercase text-white ">Crear una nueva cuenta</h1>
  <h1 class="text-1xl text-center uppercase text-gray-400">Crea una cuenta para empezar a chatear</h1>

  <alert v-if="alertMessage!=''" :alert-type="alertType" :alert-message="alertMessage"></alert>
  
  <form id="register" @submit.prevent="register" class="animated bounceInLeft " action="">
    <input v-model="username" autofocus autocomplete="off" class="appearance-none bg-gray-900 rounded w-full py-2 px-3 text-gray-100 mb-3 leading-tight focus:outline-none" type="text" value="" placeholder="Nombre de usuario">
    <input v-model="password" autocomplete="off" class="appearance-none bg-gray-900 rounded w-full py-2 px-3 text-gray-100 mb-3 leading-tight focus:outline-none" type="password" value="" placeholder="************">
    <input  autocomplete="off" class="appearance-none bg-gray-900 rounded w-full py-2 px-3 text-gray-100 mb-3 leading-tight focus:outline-none" type="password" value="" placeholder="************">
    <button class="shadow appearance-none border bg-red-500 border-red-500 rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-none mb-5" type="submit">Crear cuenta</button>
    <button type="button" @click="$router.push('/login')" class="shadow appearance-none border bg-gray-200 text-gray-900 rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-none">Iniciar Sesión</button>

  </form>
  </div>
</div>
</template>


<script>
import socket from '~/plugins/socket.io.js'
import Alert from '~/components/Alert.vue'
export default {
  middleware: ['authenticated'],

  components: {
    'alert': Alert
  },
  
  data() {
    return {
      username: '',
      password: '',
      alertMessage: '',
      alertType: 'error'
    }
  },

  methods: {
    register() {
      if(this.username!='' && this.password!='') {
        socket.emit('register', {
          username: this.username,
          password: this.password
        })

        socket.on('register', (resp) => {
          if(resp.status=='USER_CREATED') {
            this.$router.push('/chat');
          } else {
            this.alertMessage = 'La cuenta ya existe, intenta registrarte con otro nombre de usuario.'
          }
        })
        
      } else {
        this.alertMessage = 'Rellena el nombre de usuario y contraseña.'
      }

    }
  }

}
</script>
