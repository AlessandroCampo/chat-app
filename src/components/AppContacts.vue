<template>
    <div class=" bg-bg-color  w-screen h-screen flex flex-col gap-3 items-center">

        <div class="upper flex items-center justify-between p-3 px-4 w-full">
            <div class="title flex items-center gap-2">
                <h2 class="text-3xl text-white font-extrabold">
                    Contacts
                </h2>

            </div>

            <i class="fa-solid fa-circle-chevron-up text-3xl w-fit text-theme-gold" @click="closeContacts"></i>
        </div>
        <div
            class="searchbar text-gray-500 text-lg w-11/12 mx-auto flex items-center gap-2 bg-[#171310] px-8 py-2 rounded-2xl">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" v-model="search_string" placeholder="Search" class="bg-transparent">
        </div>


        <div class="contact-list py-3 h-3/4 px-4 w-full">
            <div class="contact flex items-center justify-between gap-3">
                <img src="/img/add_user.png" alt="" class="w-[60px] bg-theme-gold user-add">
                <div class="contact-info text-gray-200 flex-grow ps-2 flex flex-col gap-2 justify-start">
                    <div class="conact-name font-semibold text-theme-gold">
                        Aggiungi nuovo utente
                    </div>
                    <div class="add w-full flex justify-center gap-3 items-center">
                        <input type="text" placeholder="Insert phone number or username"
                            class="text-gray-500 text-base w-11/12 flex items-center gap-2 bg-[#171310] ps-3 py-2 ms-[-5px] rounded-2xl"
                            v-model="add_string">
                        <i class="fa-solid fa-circle-plus text-2xl text-theme-gold" @click="addContact"></i>
                    </div>
                </div>
            </div>
            <div class="contact flex items-center justify-between my-5 gap-3"
                v-for="(contact, index) in generalStore?.user?.contacts" :key="contact.uid" @click="openChat(contact)">
                <img src="/img/add_user.png" alt="" class="w-[60px] bg-theme-gold user-add">
                <div class="contact-info text-gray-200 flex-grow ps-2">
                    <div class="conact-name font-semibold">
                        {{ contact.username }}
                    </div>
                    <div class="last-text">
                        {{ contact.mood }}
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import gsap from 'gsap'
import { useGeneralStore } from '@/stores/generalStore';
import { ref, onMounted } from 'vue';
const generalStore = useGeneralStore()
const search_string = ref('');
const add_string = ref('')

const closeContacts = () => {

    let contactsPage = document.getElementById('AppContacts')
    gsap.to(contactsPage, {
        height: '0vh'
    })
}

const addContact = async () => {
    const query = add_string.value.trim()
    add_string.value = ''
    if (query == generalStore.user.username || query == generalStore.user.phone_number) {
        window.alert("I'm sorry you feel lonely, but unfortunately you can't add youself to your contacts")
        return
    }
    const add_attempt = await generalStore.addContact(query)
    console.log(add_attempt)
    if (!add_attempt) {
        window.alert('user does not exist, or its already in your contacts')
    }
}

const openChat = (contact) => {
    let activeChatsPage = document.getElementById('AppActiveChats')
    let chatPage = document.getElementById('AppChat')
    let contactsPage = document.getElementById('AppContacts')
    gsap.to(contactsPage, {
        height: '0vh'
    })
    generalStore.active_chat = contact
    generalStore.pushToActiveChats(contact)
    gsap.to(activeChatsPage, {
        width: '0vw'
    })
    gsap.to(chatPage, {
        width: '100vw'
    })
}
</script>

<style lang="scss" scoped>
.user-add {
    clip-path: circle();
}
</style>