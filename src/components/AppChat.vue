<template>
    <div class="h-screen w-screen bg-[#1b1b1b]">
        <div class="bg-theme-gold flex justify-around items-center py-4">
            <div class="chat-inter flex items-center gap-3 w-fit">
                <i class="fa-solid fa-circle-chevron-left text-3xl w-fit" @click="openContacts"></i>
                <img src="/img/avatar-test.png" alt="" class="w-[100px]">
                <div class="inter-info flex flex-col gap-1">
                    <span class="text-xl font-bold"> {{ propChat?.username }} </span>

                    <span class="text-gray-700"> {{ propChat?.status }} </span>
                </div>
            </div>
            <i class="fa-solid fa-ellipsis-vertical  text-3xl w-fit"></i>
        </div>
        <div class="chat-box py-8 px-5 h-[77%] overflow-auto">
            <div class="message-container my-3"
                :class="message.sender_uid == generalStore.user.uid ? 'from-user' : 'from-inter'"
                v-for="(message, index) in filteredMessages" :key="index">
                <div class="message" :class="message.sender_uid == generalStore.user.uid ? 'from-user' : 'from-inter'">
                    {{ message.content }}
                </div>
                <span class="message-timestamp text-sm"> {{ message.hour }} </span>
            </div>
        </div>
        <div class="toolbar-container  bg-secondary-color flex items-center justify-between p-5 rounded-2xl mx-6">
            <i class="fa-solid fa-face-smile-beam text-theme-gold"></i>
            <input type="text" placeholder="Type your message..."
                class="bg-transparent text-xl text-center text-gray-200" v-model="newText" @keydown.enter="sendMessage">
            <i class="fa-solid  text-theme-gold" :class="isTyping ? 'fa-paper-plane' : 'fa-microphone'"></i>
        </div>

    </div>


</template>

<script setup>
import gsap from 'gsap'
import { db } from '../firebase'
import { ref, onMounted, computed } from 'vue'
import { state, socket } from '../socket';
import { useGeneralStore } from '@/stores/generalStore';

const props = defineProps({
    propChat: Object
})
const isTyping = ref(false)
const newText = ref('')
const messages = ref([])
const generalStore = useGeneralStore()
const filteredMessages = computed(() => {
    return generalStore?.user?.messages.filter(message => {
        return message.sender_uid == generalStore.user.uid || message.recipient_uid == generalStore.user.uid
    });
})

// onMounted(() => {
//     messages.value = generalStore.user?.messages
// })

// socket.on('newMessage', (message) => {
//     console.log('newMessage', message)
//     messages.value.push(message)
// })


const sendMessage = () => {
    let newMessage = {
        media_type: 'text',
        content: newText.value,
        sender_phone_number: generalStore.user.phone_number,
        recipient_phone_number: generalStore.active_chat?.phone_number,
        sender_uid: generalStore.user.uid,
        recipient_uid: generalStore.active_chat?.uid,
        hour: generalStore.getCurrentHour(),
        date: generalStore.getCurrentDate(),
        timestamp: new Date(),
        is_read: false
    }
    generalStore.sendMessage(newMessage, generalStore.user.uid, generalStore.active_chat.uid)
    newText.value = ''
}

const openContacts = () => {
    let activeChatsPage = document.getElementById('AppActiveChats')
    let chatPage = document.getElementById('AppChat')
    gsap.to(activeChatsPage, {
        width: '100vw'
    })
    gsap.to(chatPage, {
        width: '0vw'
    })
}

</script>

<style scoped>
.message-container {
    @apply flex items-center gap-3
}

.message-container.from-inter {
    @apply me-auto;
}

.message-container.from-user {
    @apply ms-auto flex-row-reverse;
}

.message-timestamp {
    @apply text-gray-500;
}

.message {
    @apply px-4 py-4 max-w-72 w-fit rounded-xl;
}

.message.from-user {
    @apply text-black bg-theme-gold rounded-tr-none;
}

.message.from-inter {
    @apply text-white bg-secondary-color rounded-tl-none;
}
</style>