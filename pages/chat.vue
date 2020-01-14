<template>
<div ref="content" id="content" class="flex flex-col h-screen text-xl bg-gray-800">
  <div  class="flex flex-1 ">
    <div class="text-white w-full px-5">
      <div id="msg-container" class="text-2xl">
        <h1 class="font-2xl uppercase text-teal-100 mt-1">#Chat general</h1>
        
        <div v-if="isLoading">Cargando historial...</div>
        <div  v-else v-for="message in messages">
          <p><strong>{{ message.author }}: </strong>{{ formatLink(message.message) }} <span class="text-3xs font-mono text-orange-200">{{ formatDate(message.timestamp) }}</span> </p>
        </div>
      </div>
      <div id="typing"></div>
    </div>
    <div class="flex-1 px-5 ">
      <button @click="logout" class="appearance-none bg-gray-100 rounded w-full py-1 px-10 mt-3 text-gray-700 block">Cerrar</button>
    <div class="sidebar-users text-white">
      <ul >
        <li>TheRox</li>
        <li>rey_pato</li>
        <li>pere_gb</li>
    </ul>
    </div>
    
    </div>
  </div>
  <div class="bg-gray-800">
  <div class="md:flex">
    <div class="md:w-full md:px-2">
      <input autocomplete="off" @keyup.enter="send" v-model="message" autofocus="true" class="appearance-none bg-gray-900 rounded w-full py-2 px-3 text-gray-100 mb-3 leading-tight focus:outline-none" placeholder="Escribe algo..." />
    </div>
  </div>
  </div>

  </div>
</template>

<script>
const Cookie = process.client ? require('js-cookie') : undefined

import socket from '~/plugins/socket.io.js'
export default {
middleware: 'notAuthenticated',
 data() {
   return {
     username: 'TheRox91',
     message: '',
     response: '',
     isLoading: true,
     messages: []
   }
 },
 mounted() {
  
   console.log(this.$store.state.auth)
    this.getMessages();
 
   setInterval(() => {
    this.getMessages()
   }, 60000) // refreshing every minute
 },
 methods: {
   
   send() {
     console.log('msg sent')
     let message = {
       chat_id: 1,
       sender_id: 1,
       author: this.username,
       message: this.message
     }
      socket.emit('send-message', message)
      socket.on('send-message', (data) => {
        this.getMessages()
      })
      this.message = '';

   },

   getMessages() {
     try {
      socket.emit('get-messages')
        socket.on('get-messages', (data) => {
          this.messages = data;
      })

     } catch(error) {
       console.log('error', error)
     } finally {
       this.isLoading = false
     }
   },

   logout() {
      Cookie.remove('auth')
      this.$store.commit('setAuth', null)
      this.$router.push('/')
   },

   formatLink(message) {
     console.log(message)
     const splitMessage = message.split(' ');
     let replacedLink = message;

     splitMessage.map((word) => {
       console.log(word)
       if(word.includes("http://") || word.includes("https://")) {
          replacedLink = `<a href="${word}">link acortado</a>`;
       }
     })
       return replacedLink;
   },

   formatDate(timestamp) {

    let msPerMinute = 60 * 1000,
        msPerHour = msPerMinute * 60,
        msPerDay = msPerHour * 24,
        msPerMonth = msPerDay * 30,
        msPerYear = msPerDay * 365,
        current = Date.now();

    let elapsed = current - timestamp;
    let state;
     if(elapsed < msPerMinute) {
       if(Math.round(elapsed/1000) <= 60) {
          state = 'hace un momento';  
       }
     }
     else if(elapsed < msPerHour) {
       state = 'hace ' + Math.round(elapsed/msPerMinute)+ ' minuto(s)';  
     }

     else if(elapsed < msPerDay) {
       if(Math.round(elapsed/msPerHour)==1) {
        state = 'hace una hora';  
       } else {
        state = `hace ${Math.round(elapsed/msPerHour)} horas`;  
       }
     }
     else if (elapsed < msPerMonth) {
        if(Math.round(elapsed/msPerDay)==1) {
        state = 'hace un mes';  
       } else {
        state = `hace ${Math.round(elapsed/msPerDay)} meses`;  
       }
    }

     return state;
   }
 }
}
</script>


