<template>




    <div class="contacts-container bg-bg-color py-5 flex flex-col gap-4">

        <div class="upper flex items-center justify-between p-3 px-4">
            <h2 class="text-3xl text-white font-extrabold">
                Chats
            </h2>
            <i class="fa-solid fa-pen-to-square text-theme-gold text-3xl"></i>
        </div>
        <div
            class="searchbar text-gray-500 text-lg w-11/12 mx-auto flex items-center gap-2 bg-[#171310] px-8 py-2 rounded-2xl">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" v-model="search_string" placeholder="Search" class="bg-transparent">
        </div>
        <div class="contact-list py-3 h-3/4 px-4">
            <div class="contact flex items-center justify-between" v-for="chat in generalStore?.user?.active_chats"
                :key="chat.phone_number" @click="openChat(chat)">
                <img src="/img/avatar-test.png" alt="" class="w-[80px]">
                <div class="contact-info text-gray-200 flex-grow ps-2">
                    <div class="conact-name font-semibold text-lg">
                        {{ chat.username }}
                    </div>
                    <div class="last-text text-base text-gray-500 ">
                        {{ lastMessage(chat) }}
                    </div>
                </div>
                <div class="unread-counter rounded-full bg-theme-gold text-gray-900 w-[30px] h-[30px] flex items-center justify-center"
                    v-show="unreadMessagesCounter(chat).value != 0">
                    {{ unreadMessagesCounter(chat) }}
                    {{ console.log('Unread counter:', unreadMessagesCounter(chat)) }}
                </div>
            </div>
        </div>
        <nav
            class="relative flex justify-between w-11/12 items-center bg-secondary-color text-gray-400 py-8 text-3xl rounded-3xl px-4 mx-auto">
            <div class="icons-left flex items-center justify-between w-2/6">
                <i class="fa-solid fa-house"></i>
                <i class="fa-solid fa-compass"></i>
            </div>
            <i class="fa-solid fa-circle-plus absolute-icon text-6xl text-theme-gold" @click="openContacts"></i>
            <div class="icons-right  flex items-center justify-between w-2/6">
                <i class="fa-solid fa-comment-dots"></i>
                <i class="fa-solid fa-user"></i>
            </div>
        </nav>
        <AppContacts class="h-[0px] overflow-hidden absolute w-screen z-10" id="AppContacts"></AppContacts>
    </div>
</template>

<script setup>

import gsap from 'gsap';
import { ref, onMounted, computed } from 'vue';
import AppContacts from './AppContacts.vue';
import { useGeneralStore } from '@/stores/generalStore';


const search_string = ref('')
const generalStore = useGeneralStore()

const lastMessage = (chat) => {
    return computed(() => {
        const user_messages = generalStore?.user?.messages.filter(message => message.sender_uid === chat.uid);
        if (user_messages.length > 0) {
            const lastMessageContent = user_messages[user_messages.length - 1].content;
            console.log(lastMessageContent)
            return String(lastMessageContent).trim();
        } else {
            return `There are no messages from ${chat.username} yet`;
        }
    });
};

const unreadMessagesCounter = (chat) => {
    return computed(() => {
        const user_messages = generalStore?.user?.messages.filter(message => message.sender_uid === chat.uid);
        if (user_messages.length > 0) {
            let unread_messages_counter = 0
            user_messages.forEach((message) => {
                if (!message.is_read) {
                    unread_messages_counter++
                }
            })
            return Number(unread_messages_counter)
        } else {
            return 0
        }
    });
};



const openContacts = () => {
    let contactsPage = document.getElementById('AppContacts')
    gsap.to(contactsPage, {
        height: '100vh'
    })
}

const openChat = (chat) => {
    let activeChatsPage = document.getElementById('AppActiveChats')
    let chatPage = document.getElementById('AppChat')
    generalStore.setMessagesToRead(chat.uid)
    generalStore.active_chat = chat
    gsap.to(activeChatsPage, {
        width: '0vw'
    })
    gsap.to(chatPage, {
        width: '100vw'
    })
}

</script>

<style lang="scss" scoped>
.absolute-icon {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);

}
</style>