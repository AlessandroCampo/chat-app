
import { defineStore } from 'pinia';
import { arrayUnion, collection, doc, getFirestore, limit, orderBy, query, updateDoc, where, getDocs, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useFirestore } from '@vueuse/firebase/useFirestore'

export const useGeneralStore = defineStore('generalStore', {
  state: () => ({
    user: null,
    active_chat: null,
    message_limit: 10
  }),
  getters: {},
  actions: {
    getCurrentDate() {
      const now = new Date();
      const day = now.getDate().toString().padStart(2, '0'); // Get day with leading zero if needed
      const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Get month with leading zero if needed
      const year = now.getFullYear();
      return `${day}-${month}-${year}`; // Format: DD-MM-YYYY
    },
    getCurrentHour() {
      const now = new Date();
      const hour = now.getHours().toString().padStart(2, '0'); // Get hour with leading zero if needed
      const minute = now.getMinutes().toString().padStart(2, '0'); // Get minute with leading zero if needed
      return `${hour}:${minute}`; // Format: HH:MM
    },
    async sendMessage(message, sender, recipient) {
      console.log('new message')
      const senderRef = doc(db, "users", sender);
      const recipientRef = doc(db, "users", recipient);


      await updateDoc(senderRef, {
        messages: arrayUnion(message)
      });

      await updateDoc(recipientRef, {
        messages: arrayUnion(message)
      });

      const messagesWithRecipient = this.user.messages.filter(msg =>
        (msg.sender_uid === sender && msg.recipient_uid === recipient) ||
        (msg.sender_uid === recipient && msg.recipient_uid === sender)
      );
      console.log(messagesWithRecipient.length)
      if (messagesWithRecipient.length > this.message_limit) {
        console.log('over the limit')
        await this.cleanupOldMessages(recipient);
      }
    },
    async addContact(username_or_num) {
      let added_contact = false
      const usersCol = collection(db, 'users')
      const userRef = doc(db, 'users', this?.user.uid)
      const q = query(usersCol, where("username", "==", username_or_num)) || query(usersCol, where("phone_number", "==", username_or_num))

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        const userData = doc.data();
        const newContact = {
          uid: userData.uid,
          phone_number: userData.phone_number,
          username: userData.username,
          mood: userData.mood,
          avatar_src: userData.avatar_src,
          status: userData.status
        }
        const userExists = this.user.contacts.some(contact => contact.uid === newContact.uid);

        if (!userExists) {
          await updateDoc(userRef, {
            contacts: arrayUnion(newContact)
          });
          added_contact = true
        }

      });
      return added_contact
    },
    async cleanupOldMessages(recipient) {
      const messagesWithRecipient = this.user.messages.filter(msg =>
        (msg.sender_uid === this.user.uid && msg.recipient_uid === recipient) ||
        (msg.sender_uid === recipient && msg.recipient_uid === this.user.uid)
      );

      if (messagesWithRecipient.length > this.message_limit) {

        const sortedMessages = messagesWithRecipient.sort((a, b) => a.timestamp - b.timestamp);
        const messagesToRemove = sortedMessages.length - this.message_limit;
        const updatedMessages = sortedMessages.slice(messagesToRemove);
        const userRef = doc(db, "users", this.user.uid);
        await updateDoc(userRef, { messages: updatedMessages });
      }
    },
    async pushToActiveChats(contact) {
      const newActiveChat = contact
      const userRef = doc(db, "users", this.user.uid);
      await updateDoc(userRef, {
        active_chats: arrayUnion(newActiveChat)
      });
    },
    async setMessagesToRead(id) {
      const userRef = doc(db, "users", this.user.uid);
      this.user.messages.forEach((message) => {
        if (message.sender_uid == id) {
          message.is_read = true
        }
      })
      await updateDoc(userRef, {
        messages: this.user.messages
      });
    }


  }
});
