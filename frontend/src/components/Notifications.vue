<template>
    <div id="notifications">
        <div v-for="(notification, index) in notifications" :key="index" :class="getNotificationClass(notification)">
            {{ notification.message }}
        </div>
    </div>
</template>

<script>
    export default{
        data(){
            return{

            }
        },

        methods: {
            getNotificationClass: function(notification){
                return 'alert alert-' + notification.type;
            }
        },

        props: ['notifications']
    }
</script>