import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

import { doc, getDoc } from 'firebase/firestore';
import db from '../../../services/firebaseConnection';

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: 'read:user',
    }),
  ],
  callbacks: {
    async session(session, profile) {
      try {

        const docRef = doc(db, 'users', String(profile.sub));
        const lastDonate = await getDoc(docRef)
        .then((snapshot) => {
          if(snapshot.exists){
            return snapshot.data().lastDonate.toDate();
          }else{
            return null;
          }
        });

        return {
          ...session,
          id: profile.sub,
          vip: lastDonate ? true : false,
          lastDonate: lastDonate
        };
      } catch (err) {
        return {
          ...session,
          id: null,
          vip: false,
          lastDonate: null
        };
      }
    },
    async signIn(user, account, profile) {
      const { email } = user;
      try {
        return true;
      } catch (err) {
        console.log('Deu erro', err);
        return false;
      }
    },
  },
});
