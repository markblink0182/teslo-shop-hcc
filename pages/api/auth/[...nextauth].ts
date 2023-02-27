import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';


import { dbUsers } from '@/database';
import { JSONParser } from 'formidable/parsers';

export default NextAuth({
  providers: [
    Credentials({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Correo:', type: 'email', placeholder: 'correo@google.com'  },
        password: { label: 'Contraseña:', type: 'password', placeholder: 'Contraseña'  },
      },
      async authorize(credentials) {
        return await dbUsers.checkUserEmailPassword( credentials!.email, credentials!.password);
      }
    })
  ],
  // Custom Pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },

  // Callbacks
  jwt: {
    // secret: process.env.JWT_SECRET_SEED, // deprecated
  },
  
  session: {
    maxAge: 2592000, /// 30d
    strategy: 'jwt',
    updateAge: 86400, // cada día
  },


  callbacks: {

    async jwt({ token, user, account }) {
      if ( account ) {
        token.accessToken = account.access_token
        switch( account.type ) {
          case 'oauth': 
            token.user = await dbUsers.oAUthToDbUser( user?.email || '', user?.name || '' );
          break;
          case 'credentials':
            token.user = user;
          break;
        }
      }
      return token;
    },


    async session({ session, token, user }){

      session.accessToken = token.accessToken;
      session.user = token.user as any;
      console.log({session})
      return session;
    }
    

  }

});