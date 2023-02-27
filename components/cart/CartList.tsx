import { FC } from 'react'
import { useContext } from 'react';
import { CartContext } from '@/context';
import { ItemCounter } from '../ui';
import NextLink from 'next/link';
import { Grid, Box, Typography, Button, Link, CardActionArea, CardMedia } from '@mui/material';
import Cookies from 'js-cookie';
import { ICardProduct, IOrderItem } from '@/interfaces';

const productsInCart = Cookies.get('cart') ?  JSON.parse( Cookies.get('cart')! ): [];
console.log(productsInCart)

interface Props{
    editable?: boolean,
    products?: IOrderItem[];
}

export const CartList:FC<Props> = ({ editable = false, products }) => {
    const { cart, updateCartQuantity, removeCartProduct} = useContext(CartContext);

    const onNewCartQuantityValue = (product: ICardProduct, newQuantityValue: number) => {
        product.quantity = newQuantityValue;
        updateCartQuantity( product );
    }
    const productsToShow = products ? products : cart;

  return (
    <>
        { productsToShow.map(product=>(
            <Grid container spacing={2} key={product.slug + product.size} sx={{ mb:1 }}>
                <Grid item xs={3}>
                    {/*TODO: Llevar a la pagina del producto */}
                    <NextLink href={`/product/${product.slug}`} passHref legacyBehavior>
                        <Link>
                            <CardActionArea>
                                <CardMedia 
                                    image={`${product.images}`} 
                                    component='img'
                                    sx={{ borderRadius: '5px' }}
                                />
                            </CardActionArea>
                        </Link>
                    </NextLink>
                </Grid>
                <Grid item xs={7}>
                    <Box display='flex' flexDirection='column'>
                        <Typography variant='body1'>{ product.title}</Typography>
                        <Typography variant='body1'>Talla: <strong>{ product.size }</strong></Typography>
                        {/*TODO: Deberia ser condicional */}
                        {
                            editable 
                            ? <ItemCounter
                                currentValue={ product.quantity } 
                                maxValue={ 10 } 
                                updatedQuantity={ ( value ) => onNewCartQuantityValue(product as ICardProduct, value )}
                              /> 
                            : <Typography variant='h5'>{ product.quantity } { product.quantity > 1 ? 'productos':'producto' }</Typography>
                        }
                        
                    </Box>
                </Grid>
                <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
                <Typography variant='subtitle1'>{ `$${product.price}` }</Typography>
                {/*Editable? */}
                {
                    editable && (
                        <Button 
                            onClick={()=>removeCartProduct(product as ICardProduct)}
                            variant='text' color='secondary'>
                            Remover
                        </Button>
                    )
                }
                
                </Grid>
            </Grid>
            )) 
        }
    </>
  )
}
