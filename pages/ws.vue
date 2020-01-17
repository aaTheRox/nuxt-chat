<template>
    <div>
        <!--<send-message @send-message="send"></send-message>-->
        <send-message @send-message="sendMessage"></send-message>
    </div>
</template>

<script>

var socket;
//import {socket } from 'ws'

import SendMessage from '~/components/SendMessage'
export default {

components: {
    'send-message': SendMessage
},
    data() {
        return {
            message: '',
            socket: ''
        }
    },

    mounted() {
        socket = new WebSocket('ws://localhost:8888');
        console.log(socket)
        
        // Connection opened
        socket.addEventListener('open', (event) => {
            const data = {message: "sss"}
            socket.send(JSON.stringify(data));
        });

           socket.addEventListener('message',  (event)=> {
                console.log('----------')
                const data = {message: "-----"}
                socket.send(JSON.stringify(data));
            });

        socket.addEventListener('error', (e) => {
            console.warn('No se ha podido establecer la conexión con ws')
        })
    },

    methods: {
         sendMessage(payload) {
            socket.send(JSON.stringify(payload));
        }
    }
}

</script>