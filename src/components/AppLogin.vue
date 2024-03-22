<template>
    <div>
        <form action="
        " class="flex flex-col gap-2">
            <label for="username"> username </label>
            <input type="text" id="username" v-model="username">
            <label for="phone-number"> Phone Number </label>
            <input type="text" id="phone-number" v-model="user_phone_number" pattern="[0-9]*">
            <button id="sign-in-button" @click="onSignInSubmit"
                class="bg-theme-gold rounded-xl px-4  py-2 w-1/4 mx-auto">
                Register
            </button>
        </form>
    </div>
</template>

<script setup>
import { db, auth } from '../firebase'
import { ref, onMounted } from 'vue'
import { collection, doc, addDoc, setDoc, getFirestore, limit, orderBy, query } from "firebase/firestore";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { state, socket } from '../socket';
import { useGeneralStore } from '../stores/generalStore'
import { useFirestore } from '@vueuse/firebase/useFirestore'
const user_phone_number = ref('')
const username = ref('')
const generalStore = useGeneralStore()
let userDocRef
let appVerifier


onMounted(() => {
    socket.connect()
    appVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
        'size': 'invisible',
        'callback': (response) => {
        }
    });
})

const onSignInSubmit = () => {

    signInWithPhoneNumber(auth, user_phone_number.value, appVerifier)
        .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            const code = prompt("Please enter the verification code sent to your phone:");
            if (code) {
                return confirmationResult.confirm(code);
            } else {
                throw new Error("Verification code is required.");
            }
        }).then(async (result) => {
            const user = result.user;
            const docRef = doc(db, 'users', user.uid)
            await setDoc(docRef, {
                username: username.value.toLowerCase().trim(),
                uid: user.uid,
                phone_number: user_phone_number.value.trim(),
                avatar_src: '',
                status: "Offline",
                mood: "Hey there, I'm using Boolzap!",
                contacts: [],
                messages: [],
                groups: [],
                active_chats: [],
            });


            console.log("User signed in successfully:", user);

        }).
        catch((error) => {
            console.log(error)
        });
}
</script>

<style lang="scss" scoped></style>