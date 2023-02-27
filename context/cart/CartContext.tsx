import { createContext } from 'react';
import { ICardProduct } from '@/interfaces';
import { ShippingAddress } from './';

interface contextProps {
     cart: ICardProduct[];
     isLoaded: boolean;
     numberOfItems: number;
     subTotal: number;
     tax: number;
     total: number;
     shippingAddress?:ShippingAddress

     addProductToCard: (product: ICardProduct) => void;
     updateCartQuantity: (product: ICardProduct) => void;
     removeCartProduct: (product: ICardProduct) => void;
     updateAddress: (address: ShippingAddress) => void
     createOrder: () => Promise<{ hasError:boolean, message: string}>
}

export const CartContext = createContext({} as contextProps);