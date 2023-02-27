import { useEffect } from 'react';
import { CartContext, CartReducer } from './'
import { FC, PropsWithChildren, useReducer } from 'react'
import { ICardProduct, IOrder } from '@/interfaces'
import Cookie from 'js-cookie';
import Product from '@/models/Product';
import tesloApi from '../../api/tesloApi';
import axios from 'axios';

export interface CartState{
    isLoaded: boolean
    cart: ICardProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
    shippingAddress?: ShippingAddress;
}

export interface ShippingAddress {
  firstName: string;
  lastName : string;
  address  : string;
  address2?: string;
  zip      : string;
  city     : string;
  country  : string;
  phone    : string;
}


const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
     cart:[],
     numberOfItems: 0,
     subTotal: 0,
     tax: 0,
     total: 0,
     shippingAddress: undefined
}

export const CartProvider:FC<PropsWithChildren> = ({children }) => {
     const [state, dispatch] = useReducer(CartReducer, CART_INITIAL_STATE);

     useEffect(() => {
      try {
          const cookieProducts = Cookie.get('cart') ? JSON.parse( Cookie.get('cart')! ): []
          dispatch({ type: '[Cart] - Load Cart from cookies | storage', payload: cookieProducts });
      } catch (error) {
          dispatch({ type: '[Cart] - Load Cart from cookies | storage', payload: [] });
      }
  }, []);
  
      useEffect(() => {
        if ( Cookie.get('firstName')){
            const shippingAddress = {
                firstName : Cookie.get('firstName') || '',
                lastName  : Cookie.get('lastName') || '',
                address   : Cookie.get('address') || '',
                address2  : Cookie.get('address2') || '',
                zip       : Cookie.get('zip') || '',
                city      : Cookie.get('city') || '',
                country   : Cookie.get('country') || '',
                phone     : Cookie.get('phone') || '',
            }
            
            dispatch({ type:'[Cart] - LoadAddress from Cookies', payload: shippingAddress })
        }
    }, [])

     useEffect(() => {
      if (state.cart.length > 0){
        Cookie.set('cart', JSON.stringify(state.cart))
      }
    }, [state.cart]);
     
    useEffect(() => {
      const numberOfItems = state.cart.reduce( ( prev, current ) => current.quantity + prev , 0 );
      const subTotal = state.cart.reduce( ( prev, current ) => (current.price * current.quantity) + prev, 0 );
      const taxRate =  Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
  
      const orderSummary = {
          numberOfItems,
          subTotal,
          tax: subTotal * taxRate,
          total: subTotal * ( taxRate + 1 )
      }

      dispatch({ type:'[Cart] - [Cart] - Update order summary', payload: orderSummary} );
  }, [state.cart]);


     const addProductToCard = (product:ICardProduct)=>{
        
        /* Checar que no se haya agregado el producto, valida ID */
        const productInCart = state.cart.some(prod => prod._id === product._id);

        if(!productInCart){
          return dispatch({ type:'[Cart] - Update products in car', payload:[...state.cart, product] });
        }

        /* Checar que no se haya agregado el producto, valida ID + Talla */
        const productInCartButDifferentSize = state.cart.some(prod=>prod._id === product._id && prod.size === product.size);
        if(!productInCartButDifferentSize){
          return dispatch({ type:'[Cart] - Update products in car', payload:[...state.cart, product] });
        }

        /*Acumular: Llego aqui porque el producto ya existe en el carrito y ademas es la misma tall */
        const updatedProducts = state.cart.map(prod=>{
          if(prod._id !== product._id) return prod;
          if( prod.size !== product.size) return prod;

          /*Actualizar la cantidad */
          prod.quantity += product.quantity;
          return prod;
        })

        dispatch({ type:'[Cart] - Update products in car', payload: updatedProducts });
     }

     const updateCartQuantity = (product: ICardProduct)=>{
      dispatch({ type:'[Cart] - Change cart quantity', payload: product })
     }

     const removeCartProduct =(product:ICardProduct)=>{
      dispatch({ type:'[Cart] - Remove product in cart', payload: product })
     }

     const updateAddress = ( address: ShippingAddress ) => {
      Cookie.set('firstName',address.firstName);
      Cookie.set('lastName',address.lastName);
      Cookie.set('address',address.address);
      Cookie.set('address2',address.address2 || '');
      Cookie.set('zip',address.zip);
      Cookie.set('city',address.city);
      Cookie.set('country',address.country);
      Cookie.set('phone',address.phone);

      dispatch({ type: '[Cart] - Update Address', payload: address });
  }

  const createOrder = async ():Promise<{ hasError:boolean, message: string}>=>{

   if(!state.shippingAddress){
    throw new Error('No hay dirección de entrega');
   }

   const body:IOrder  = {
    orderItems: state.cart.map( p => ({
        ...p,
        size: p.size!
    })),
    shippingAddress: state.shippingAddress,
    numberOfItems: state.numberOfItems,
    subTotal: state.subTotal,
    tax: state.tax,
    total: state.total,
    isPaid: false
   }

    try {

      const { data } = await tesloApi.post<IOrder>('/orders', body)
      dispatch({ type:'[Cart] - Order complete'})

      return {
        hasError: false,
        message: data._id!
      }
    } catch (error) {
      if(axios.isAxiosError(error)){
        return {
          hasError: true,
          message: error.response?.data.message
        }
      }

      return {
        hasError: true,
        message: 'Ocurrió un error al procesar la orden.'
      }
    }
  }

     return (
       <CartContext.Provider value={{
         ...state,
         addProductToCard,
         updateCartQuantity,
         removeCartProduct,
         updateAddress,
         createOrder
       }}>
      { children }
      </CartContext.Provider>
      )
}