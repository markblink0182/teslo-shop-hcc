import { useContext, useEffect, useState } from 'react';
import { CartContext } from '@/context';
import NextLink from 'next/link';
import { ShopLayout } from '@/components/layouts';
import { CartList, OrderSummary } from '@/components/cart';
import { Typography, Grid, Card, CardContent, Divider, Box, Button, Link, Chip } from '@mui/material';
import { countries } from '../../utils';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const SummaryPage = () => {
    const router = useRouter();
    const { shippingAddress, numberOfItems, createOrder  } = useContext(CartContext);
    const [isPosting, setIsPosting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
      if(!Cookies.get('firstName')){
        router.push('/checkout/address')
      }
    }, [router])
    
    if ( !shippingAddress ) {
        return <></>;
    }

    const { firstName, lastName, address, address2 = '', city, country, phone, zip } = shippingAddress;
    
    const onCreateOrder = async ()=>{
        setIsPosting(true);
        const { hasError, message } = await createOrder();
        
        if(hasError){
            setIsPosting(false),
            setErrorMessage(message);
            return;
        }

        router.replace(`/orders/${ message }`); //message es el Id de la orden
    }
  return (
    <ShopLayout title='Resumen de la orden' pageDescription='Resumen de la orden'>
        <Typography variant='h1' component={'h1'}>Resumen de la orden</Typography>
        <Grid container>
            <Grid item xs={12} sm={7}>
                {/*CarList*/}
                <CartList />
            </Grid>
            <Grid item xs={12} sm={5} >
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2'>Resumen ({numberOfItems} { numberOfItems === 1 ? 'producto':'productos' })</Typography>
                        <Divider sx={{ my:1 }} />
                        <Box display={'flex'} justifyContent='space-between'>
                        <Typography variant='subtitle1'>Dirección de entrega</Typography>
                            <NextLink href={'/checkout/address'} passHref legacyBehavior>
                                <Link underline='always'>Editar</Link>
                            </NextLink>
                        </Box>
                        <Typography>{firstName} {lastName}</Typography>
                        <Typography>{ address }{ address2 ? `, ${address2}` : ''  }</Typography>
                        <Typography>{ city }, { zip }</Typography>
                        <Typography>{ country }</Typography>
                        <Typography>{ phone }</Typography>
                        <Divider />
                        <Box display={'flex'} justifyContent='end'>
                            <NextLink href={'/cart'} passHref legacyBehavior>
                                <Link underline='always'>Editar</Link>
                            </NextLink>
                        </Box>
                        {/*OrderSummary*/}
                        <OrderSummary />
                        <Box sx={{ mt:3 }} display='flex' flexDirection='column'>
                            <Button 
                            disabled={ isPosting }
                            onClick={ onCreateOrder }
                            color='secondary' className='circular-btn' fullWidth>
                                Confirmar orden
                            </Button>
                        <Chip 
                            color='error'
                            label={ errorMessage }
                            sx={{ display: errorMessage ? 'flex':'none', mt:2 }}
                        />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

export default SummaryPage