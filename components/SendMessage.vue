<template>
<div>
    <input appearance-none class="bg-gray-900 rounded w-full py-2 px-3 text-gray-100 mb-3 leading-tight focus:outline-none" placeholder="Escribe algo..." @keyup.enter="sendMessage($event.target)"autofocus v-model="message" type="text">
</div>
</template>

<script>
    export default {

        data() {
            return {
                message: ''
            }
        },
        methods: {
            
            sendMessage(target) {
            if (target)
                this.$emit('send-message', this.message);
                this.message = '' // clear message 
            }
        }
    }
</script>