<template>
  <div>
    <input type="text" v-model="user_phone_number">
    {{ state.connected }}
    <button id="sign-in-button" type="submit" @click="onSignInSubmit"> SIGN IN BUTTON </button>
  </div>
</template>

<script setup>
import { db, auth } from './firebase'
import { ref, onMounted } from 'vue'
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { state, socket } from './socket';
const user_phone_number = ref('')
let appVerifier

onMounted(() => {
  console.log(socket)
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
        // If the user provided a code, proceed with confirmation
        return confirmationResult.confirm(code);
      } else {
        // If the user cancels the prompt or doesn't enter a code, handle it accordingly
        throw new Error("Verification code is required.");
      }
    }).then((result) => {
      const user = result.user;
      console.log("User signed in successfully:", user);
    }).
    catch((error) => {
      console.log(error)
    });
}


</script>

<style scoped></style>