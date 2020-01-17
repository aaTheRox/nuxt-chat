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
      <div><strong>{{ userTyping.name }}</strong> {{ userTyping.callback }}</div>
      
    </div>
    <div class="flex-1 px-5 ">
      <button @click="logout" class="appearance-none bg-gray-100 rounded w-full py-1 px-10 mt-3 text-gray-700 block">Cerrar</button>
    <div class="sidebar-users text-white">
      <ul>
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

      <send-message @send-message="handleKeyPress"></send-message>

      <!--<input autocomplete="off" @keyup="handleKeyPress" v-model="message" autofocus="true" class="appearance-none bg-gray-900 rounded w-full py-2 px-3 text-gray-100 mb-3 leading-tight focus:outline-none" placeholder="Escribe algo..." />
    -->
    </div>
  </div>
  </div>

  </div>
</template>

<script>
const Cookie = process.client ? require('js-cookie') : undefined

import { fas } from '@fortawesome/free-solid-svg-icons'
import {utils} from '~/plugins/utils.js'
import axios from 'axios'

import SendMessage from '~/components/SendMessage'
var socket;
export default {
middleware: 'notAuthenticated',
components: {
  'send-message': SendMessage
},
 data() {
   return {
     message: '', // Message sent
     isLoading: true,
     messages: [], // Array of total messages
     editMode: false, // Enables edit mode 
     editId: 0, // message id to edit
     userTyping: { // Saves on typing data 
       name: '',
       callback: ''
     }
   }
 },
 created() {
    this.getMessages();
  /* setInterval(() => {
    this.getMessages()
   }, 60000) // refreshing every minute
   */
 },

 mounted() {
   console.log(this.$store.state.auth)
   console.log('check auth', utils.checkAuthToken(this.$store.state.auth.accessToken, "62rzhzu48s8yu3donarkm"))

   socket =  new WebSocket(process.env.WS_URL);
    socket.addEventListener('message', (data) => {
        console.log(data)
        //this.getMessages()
    });
 },
 methods: {

    async getMessages() {
    const parent = this;
  try {

      await axios
        .get(`${process.env.AXIOS_URL}getMessages`, {
        })
        .then(resp => {
            this.messages = resp.data;
       })
      }catch(e){
        console.log(e)
        this.$toast.error('No se han podido recuperar los mensajes, inténtalo más tarde.', {
            duration: 2000
          })
        } finally {
          parent.isLoading = false
        } 
   },

   logout() {
      Cookie.remove('auth')
      this.$store.commit('setAuth', null)
      this.$router.push('/')
   },

   handleKeyPress(messageContent) {
    // ENTER | SEND MESSAGE
     switch(event.keyCode || event.which) {
       case 13:
        if(!this.editMode) {
          if(event.which==13 || event.keyCode==13) {
            console.log(socket)
            if(messageContent !='' && socket.readyState===1) {
              let message = {
                message_id: this.editId,
                sender_id: this.$store.state.auth.userId,
                author: this.$store.state.auth.username,
                message: messageContent
              }

              console.log('---')
              socket.send(JSON.stringify(message));
            this.message = '';
            this.getMessages();

            } else {
              this.$toast.error('No se ha podido enviar el mensaje, inténtalo más tarde.')
            }
          }

     } else {
       // SENDING EDITED MESSAGE
      /* const message_id = this.editId; // cambiar por msg_id
       socket.emit('edit-message', {message_id, message: this.message});
       socket.on('edit-message', (resp) => {
         this.message = ''
         this.getMessages()
         this.editMode = false;
       })
    */ 
    }
       break;

       // KEY UP | EDIT MODE
       case 38:
        this.editMode = true;
        const sender_id = this.$store.state.auth.userId;
        /*
          socket.emit('get-mylast-message', sender_id);
          socket.on('get-mylast-message', (lastMessage) => {
          this.message = lastMessage.message
          this.editId = lastMessage.message_id
        })
          */
       break;
       // ESC | EXIT EDIT MODE
       case 27:
        this.editMode = false;
        this.message = ''
       break;

       default:
       if(this.message !='') {
       /* socket.emit('typing', {
          author: this.$store.state.auth.username
        })
        */
        this.onUserTyping()

        var timeout = setTimeout(this.clearTyping, 2000);
       }
      break;
     }
   },

   send(payload) {
      socket.send(JSON.stringify(payload));
   },
  onUserTyping() {
    socket.on('typing', (data) => {
          if (data && data.author != '') {

            this.userTyping = {
              name: data.author,
              callback: 'está escribiendo...'
            }
          } else {
            this.userTyping = {
              name: '',
              message: ''
            }
          }
        })
  },
  clearTyping() {
      //socket.emit("typing", false);
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


