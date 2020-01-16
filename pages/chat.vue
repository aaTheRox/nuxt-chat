<template>
<div ref="content" id="content" class="flex flex-col h-screen text-xl bg-gray-800 ">
  <div  class="flex flex-1 overflow-y-auto">
    <div class="text-white w-full px-5">
      <div id="msg-container" class="text-2xl">
        <h1 class="font-2xl uppercase text-teal-100 mt-1">#Chat general</h1>
        
        <div v-if="isLoading">Cargando historial...</div>
        <div  v-else v-for="message in messages">
          <p><strong>{{ message.author }}: </strong>{{ formatLink(message.message) }} <span class="text-sm text-orange-200" v-if="message.edited">
              (editado)
            </span>
          <span class="text-3xs font-mono text-orange-200">{{ formatDate(message.timestamp) }}
            </span> </p>
        </div>
      </div>
      <div id="typing"></div>
      
      
    </div>
    <div class="flex-1 px-5 ">
      <button @click="logout" class="appearance-none bg-gray-100 rounded w-full py-1 px-10 mt-3 text-gray-700 block">Cerrar</button>
    <div class="sidebar-users text-white">
      <ul >
        <li>usuario 1</li>
        <li>usuario 2</li>
        <li>usuario 3</li>
    </ul>
    </div>
    
    </div>
  </div>
  <div class="bg-gray-800">
  <div class="md:flex">
    <div class="md:w-full md:px-2">
      <input autocomplete="off" @keyup="handleKeyPress" v-model="message" autofocus="true" class="appearance-none bg-gray-900 rounded w-full py-2 px-3 text-gray-100 mb-3 leading-tight focus:outline-none" placeholder="Escribe algo..." />
    </div>
  </div>
  </div>

  </div>
</template>

<script>
const Cookie = process.client ? require('js-cookie') : undefined

 import { fas } from '@fortawesome/free-solid-svg-icons'
import {utils} from '~/plugins/utils.js'
import socket from '~/plugins/socket.io.js'
export default {
middleware: 'notAuthenticated',
 data() {
   return {
     username: 'TheRox91',
     message: '',
     response: '',
     isLoading: true,
     messages: [],
     editMode: false
   }
 },
 mounted() {
   console.log(this.$store.state.auth)
 },

 created() {
this.getMessages();
 
   setInterval(() => {
    this.getMessages()
   }, 60000) // refreshing every minute
 },
 methods: {

    getMessages() {

      try {
      const emit = socket.emit('get-messages')

        socket.on('get-messages', (data) => {
          this.messages = data;
      })
      } catch(e) {
        console.log('errorrr')
        this.$toast.error('El servidor no responde, inténtalo más tarde.', {duration: 2000})
      }

       this.isLoading = false
     
   },

   logout() {
      Cookie.remove('auth')
      this.$store.commit('setAuth', null)
      this.$router.push('/')
   },

   handleKeyPress() {

     switch(event.keyCode || event.which) {
       // ENTER | SEND MESSAGE
       case 13:
        if(!this.editMode) {
          if(event.which==13 || event.keyCode==13) {
            if(this.message !='') {
              let message = {
              chat_id: 1,
              sender_id: 1,
              author: this.username,
              message: this.message
            }
            const emit = socket.emit('send-message', message)
            socket.on('send-message', (data) => {
              this.getMessages()
            })

            if(!emit.connected) {
              this.$toast.error('No se ha podido enviar el mensaje, inténtalo más tarde.')
            }

            this.message = '';
            }
            
          }

     } else {
       // SENDING EDITED MESSAGE
       const created_date = 1579086991627; // cambiar por msg_id
       socket.emit('edit-message', {created_date, message: this.message});
       socket.on('edit-message', (resp) => {
         this.message = ''
         this.getMessages()
       })
     }
       break;

       // KEY UP | EDIT MODE
       case 38:
        this.editMode = true;
          socket.emit('get-mylast-message');
          socket.on('get-mylast-message', (lastMessage) => {
          this.message = lastMessage.message
        })
       break;
       // ESC | EXIT EDIT MODE
       case 27:
        this.editMode = false;
        this.message = ''
       break;
     }
    
   },

   formatLink(message) {
     const splitMessage = message.split(' ');
     let replacedLink = message;

     splitMessage.map((word) => {
       if(word.includes("http://") || word.includes("https://")) {
          replacedLink = `<a href="${word}">link acortado</a>`;
       }
     })
       return replacedLink;
   },

   formatDate(time) {
     return utils.formatDate(time)
   }

   
 }
}
</script>


