import { AuthContext, AuthReducer } from './'
import { FC, PropsWithChildren, useReducer, useEffect } from 'react';
import { IUser } from '@/interfaces';
import { tesloApi } from '@/api';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { signToken } from '../../utils/jwt';

export interface AuthState{
    isLoggedIn: boolean;
    user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn:false,
    user: undefined,
}

export const AuthProvider:FC<PropsWithChildren> = ({children }) => {
    const router = useRouter();
    const { data, status } = useSession();
     const [state, dispatch] = useReducer(AuthReducer, AUTH_INITIAL_STATE);

     useEffect(() => {
        if ( status === 'authenticated' ) {
            dispatch({ type: '[Auth] - Login', payload: data?.user as IUser })
        }
    }, [ status, data ])

/*      useEffect(() => {
         checkToken();
     }, []) */

     const checkToken = async()=>{
        if(!Cookies.get('token')){
            return;
        }

        try {
            const { data } = await tesloApi.get('/user/validate-token');
            const { token, user } = data;
            Cookies.set('token', token);
            dispatch({ type:'[Auth] - Login', payload:user });
        } catch (error) {
            Cookies.remove('token');
        }
    }
     

     const loginUser = async(email:string, password:string):Promise<boolean> =>{
        try {
            const { data } = await tesloApi.post('/user/login', {email, password});
            const { token, user } = data;
            Cookies.set('token', token);
            dispatch({ type:'[Auth] - Login', payload:user })
            return true;
        } catch (error) {
            return false;
        }
     }
    
     const registerUser = async(name:string, email:string, password:string):Promise<{ hasError:boolean, message?:string }>=>{
        try {
            const { data } = await tesloApi.post('/user/register', { name, email, password });
            const { token, user } = data;
            Cookies.set('token', token);
            dispatch({ type:'[Auth] - Login', payload:user });

            return{
                hasError: false
            }
        } catch (error) {
            if(axios.isAxiosError(error)){
                return {
                    hasError: true,
                    message: error.response?.data.message
                }
            }

            return{
                hasError: true,
                message: 'No se pudo crear el usuario.'
            }
        }
    }

    const logout = () => {
        Cookies.remove('cart');
        Cookies.remove('country');
        Cookies.remove('phone')
        Cookies.remove('city')
        Cookies.remove('zip')
        Cookies.remove('address2')
        Cookies.remove('address')
        Cookies.remove('lastName')
        Cookies.remove('firstName')
        signOut({callbackUrl:'/'});
    }

     return (
       <AuthContext.Provider value={{
         ...state,

         //Metodos.
         loginUser,
         registerUser,
         logout
       }}>
      { children }
      </AuthContext.Provider>
      )
}
