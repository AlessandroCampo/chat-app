<template>
  <AppLogin v-if="!isAuthenticated"></AppLogin>
  <div class="app-container flex flex-row-reverse" v-else>
    <AppChat id="AppChat" class="overflow-hidden" :propChat="generalStore.active_chat"></AppChat>
    <AppActiveChats class="w-[0px] overflow-hidden" id="AppActiveChats"></AppActiveChats>
  </div>

</template>

<script setup>
import AppChat from './components/AppChat.vue'
import AppLogin from './components/AppLogin.vue'
import AppContacts from './components/AppActiveChats.vue'
import { db, auth } from './firebase'
import { ref, onMounted } from 'vue'
import { collection, doc } from 'firebase/firestore'
import { getAuth, onAuthStateChanged, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { state, socket } from './socket';
import { useGeneralStore } from './stores/generalStore'
import { useAuth } from '@vueuse/firebase/useAuth'
import { useFirestore } from '@vueuse/firebase/useFirestore'
import AppActiveChats from './components/AppActiveChats.vue';
const { isAuthenticated, user } = useAuth(auth)
const generalStore = useGeneralStore()
let appVerifier


onMounted(() => {
  // socket.connect()
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userRef = doc(db, 'users', user.uid)
      console.log(user)
      generalStore.user = useFirestore(userRef)
      console.log(useFirestore(userRef))
    } else {
      console.log('no user')
    }
  });
});



</script>

<style scoped></style>