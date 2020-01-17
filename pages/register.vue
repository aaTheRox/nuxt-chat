<template>
<div class="bg-gray-800 h-screen overflow-y-hidden flex justify-center items-center">
  
  <div class="md:w-2/5 sm:px-5">
  

  <h1 class="text-3xl text-center uppercase text-white ">Crear una nueva cuenta</h1>
  <h1 class="text-1xl text-center uppercase text-gray-400">Crea una cuenta para empezar a chatear</h1>

  <alert v-if="alertMessage!=''" :alert-type="alertType" :alert-message="alertMessage"></alert>
  
  <form id="register" @submit.prevent="register" class="animated bounceInLeft " action="">
    <input v-model="username" autofocus autocomplete="off" class="appearance-none bg-gray-900 rounded w-full py-2 px-3 text-gray-100 mb-3 leading-tight focus:outline-none" type="text" value="" placeholder="Nombre de usuario">
    <input v-model="password" autocomplete="off" class="appearance-none bg-gray-900 rounded w-full py-2 px-3 text-gray-100 mb-3 leading-tight focus:outline-none" type="password" value="" placeholder="************">
    <input v-model="confirm_pass" autocomplete="off" class="appearance-none bg-gray-900 rounded w-full py-2 px-3 text-gray-100 mb-3 leading-tight focus:outline-none" type="password" value="" placeholder="************">
    <button class="shadow appearance-none border bg-red-500 border-red-500 rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-none mb-5" type="submit"><fa v-if="isLoading" class="text-1xl spin" icon="circle-notch" :style="{ color: 'white' }"/>&nbsp; Crear cuenta</button>
    <button type="button" @click="$router.push('/login')" class="shadow appearance-none border bg-gray-200 text-gray-900 rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-none">Iniciar Sesión</button>

  </form>
  </div>
</div>
</template>


<script>
const Cookie = process.client ? require('js-cookie') : undefined

import socket from '~/plugins/socket.io.js'
import Alert from '~/components/Alert.vue'
import axios from 'axios'

export default {
  middleware: ['authenticated'],

  components: {
    'alert': Alert
  },
  
  data() {
    return {
      isLoading: false,
      username: 's',
      password: 's',
      confirm_pass: 's',
      alertMessage: '',
      alertType: 'error'
    }
  },

  methods: {
  async register() {
       this.isLoading = true
     if(this.username!='' && this.password!='' && this.confirm_pass) {

       if(this.password != this.confirm_pass) {
       this.alertMessage = 'Las contraseñas no coinciden'
       } else {

         try {
      await axios
        .post(`${process.env.AXIOS_URL}register`, {
          username: this.username,
          password: this.password
        })
        .then(resp => {
          console.log(resp.data)
         if(resp.data.status=='USER_CREATED') {
            const auth = {
              accessToken: resp.data.accessToken,
              username: this.username,
              userId: resp.data.userId
            }
            this.$store.commit('setAuth', auth) // mutating to store for client rendering
            Cookie.set('auth', auth) // saving token in cookie for server rendering
           this.$router.push('/chat');
          } else {
             this.alertMessage = 'Este usuario ya existe'
          }
          
       })
      }catch(e){
        console.log(e)
        this.$toast.error('Error del servidor, inténtalo más tarde...', {
            duration: 2000
          })
        } finally {
          this.isLoading = false
        } 

       }

       
    } else {
        this.alertMessage = 'Rellena el nombre de usuario y contraseña'
        this.isLoading = false
      }
  }
  }

}
</script>
