<template>
    <div  class="px-4 py-3 text-white text-center rounded mb-3" :class="classes" role="alert">
        <p class="font-bold"">{{alertMessage}}</p>
    </div>
</template>

<script>
export default {
    name: 'alert',
    props: ['alertMessage', 'alertType'],
    data() {
        return {
            classes: ''
        }
    },

    created() {
        this.setClasses()
    },
    methods: {
        setClasses() {
            switch(this.alertType) {
                case 'error':
                    this.classes = 'bg-red-100 text-red-800';
                break;
        
                case 'success':
                    this.classes = 'bg-green-100 text-green-800';
                break;    
            }
        }
    }
}
</script>