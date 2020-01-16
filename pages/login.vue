<template>
<div class="bg-gray-800 h-screen overflow-y-hidden flex justify-center items-center">
  
  <div class="md:w-2/5 sm:px-5">

   <h1 class="text-3xl text-center uppercase text-white mb-3">
    Iniciar sesión
  </h1>

  <alert v-if="alertMessage!=''" :alert-type="alertType" :alert-message="alertMessage"></alert>
  
  <form @submit.prevent="login" id="login" class="animated bounceInLeft">
    <input v-model="username" autofocus autocomplete="off" class="appearance-none bg-gray-900 rounded w-full py-2 px-3 text-gray-100 mb-3 leading-tight focus:outline-none" type="text" value="" placeholder="Nombre de usuario" id="user">
    <input v-model="password" autofocus autocomplete="off" class="appearance-none bg-gray-900 rounded w-full py-2 px-3 text-gray-100 mb-3 leading-tight focus:outline-none" type="password" value="" placeholder="************" id="pass">
    <button type="submit" class="shadow appearance-none border bg-red-500 border-red-500 rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-none mb-5"><fa v-if="isLoading" class="text-1xl spin" icon="circle-notch" :style="{ color: 'white' }"/>&nbsp; Iniciar sesión</button>
    <button type="button" @click="$router.push('/register')" class="shadow appearance-none border bg-gray-200 text-gray-900 rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-none">Crear cuenta</button>
  </form>
  </div>
</div>
</template>

<script>
import { mapMutations } from 'vuex'
const Cookie = process.client ? require('js-cookie') : undefined

import socket from '~/plugins/socket.io.js'
import Alert from '~/components/Alert.vue'
import utils from '~/components/Utils.vue'
import axios from 'axios'
export default {
  components: {
    'alert': Alert,
    utils
  },
  middleware: ['authenticated'],

  data() {
    return {
      isLoading: false,
      username: '',
      password: '',
      alertMessage: '',
      alertType: 'error'
    }
  },

  methods: {
    async  login() {
       this.isLoading = true
     if(this.username!='' && this.password!='') {

       try {
      await axios
        .post('http://localhost:8080/login', {
          username: this.username,
          password: this.password
        })
        .then(resp => {
          if(resp.data.status=='LOGIN_SUCCESS') {
            console.log(resp)
            const auth = {
              accessToken: resp.data.accessToken
            }
            this.$store.commit('setAuth', auth) // mutating to store for client rendering
            Cookie.set('auth', auth) // saving token in cookie for server rendering
            this.$router.push('/chat');
          } else {
             this.alertMessage = 'Nombre de usuario o contraseña incorrecto'
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
    } else {
        this.alertMessage = 'Rellena el nombre de usuario y contraseña'
        this.isLoading = false
      }
  }
}
}
</script>
