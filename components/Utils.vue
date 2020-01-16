<template>
    
</template>

<script>
    
export default {
    methods: {
        launch(message = 'null', theme='bubble', position='top-center', duration=2000) {
            this.$toast.error(message, { 
                theme,
                position,
                duration
            });
        }
    }
}
</script>