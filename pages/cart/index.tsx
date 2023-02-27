import { useContext, useEffect } from 'react'
import { CartContext } from '@/context';
import { useRouter } from 'next/router';
import { ShopLayout } from '@/components/layouts';
import { CartList, OrderSummary } from '@/components/cart';
import { Typography, Grid, Card, CardContent, Divider, Box, Button } from '@mui/material';


const CartPage = () => {

    const { isLoaded, cart } = useContext(CartContext)
        const router = useRouter();
        
    useEffect(() => {
        if(isLoaded && cart.length == 0){
            router.replace('/cart/empty')
        }
    }, [isLoaded,cart,router ]);

    if(!isLoaded || cart.length == 0){
        return <></>
    }
    
  return (
    <ShopLayout title='Carrito-3' pageDescription='Carrito de compras'>
        <Grid container>
            <Grid item xs={12} sm={7}>
                {/*CarList*/}
                <CartList editable />
            </Grid>
            <Grid item xs={12} sm={5} >
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2'>Orden</Typography>
                        <Divider sx={{ my:1 }} />
                        {/*OrderSummary*/}
                        <OrderSummary />
                        <Box sx={{ mt:3 }}>
                            <Button 
                                href='/checkout/address'
                                color='secondary' 
                                className='circular-btn' 
                                fullWidth>
                                    Checkout
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

export default CartPage