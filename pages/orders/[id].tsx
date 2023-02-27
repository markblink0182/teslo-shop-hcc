import {FC, PropsWithChildren, useState} from 'react'
import { PayPalButtons } from "@paypal/react-paypal-js";
import { ShopLayout } from '@/components/layouts';
import { CartList, OrderSummary } from '@/components/cart';
import { Typography, Grid, Card, CardContent, Divider, Box, Button, Link, Chip } from '@mui/material';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react';
import { dbOrders } from '@/database';
import { IOrder } from '@/interfaces';
import { tesloApi } from '@/api';
import { useRouter } from 'next/router';

interface Props{
    order:IOrder
}

export type OrderResponseBody = {
    id: string;
    status:
        | "COMPLETED"
        | "SAVED"
        | "APPROVED"
        | "VOIDED"
        | "PAYER_ACTION_REQUIRED";
}

const OrderPage:FC<PropsWithChildren<Props>> = ({order}) => {
    const { shippingAddress } = order;
    const [isPaying, setIsPaying] = useState(false);
    const router = useRouter();

    const onOrderCompleted = async (details:OrderResponseBody)=>{
        if(details.status !== 'COMPLETED'){
            return alert('No hay pago en pay pal')
        }

        setIsPaying(true);
        try {
            const { data } = await tesloApi.post(`/orders/pay`,{
                transactionId:details.id,
                orderId:order._id
            })
            router.reload();
        } catch (error) {
            setIsPaying(false);
            console.log(error)
        }
    }

  return (
    <ShopLayout title='Resumen de la orden' pageDescription='Resumen de la orden'>
        <Typography variant='h1' component={'h1'}>Orden: { order._id }</Typography>
        {
            order.isPaid
            ?(
                <Chip 
                    sx={{ my: 2 }}
                    label="Orden ya fue pagada"
                    variant='outlined'
                    color="success"
                    icon={ <CreditCardOutlinedIcon /> }
            />            
            )
            :(
                <Chip 
                    sx={{ my: 2 }}
                    label="Pendiente de pago"
                    variant='outlined'
                    color="error"
                    icon={ <CreditCardOutlinedIcon /> }
                />
            )
        }
 
        <Grid container className='fadeIn'>
            <Grid item xs={12} sm={7}>
                {/*CarList*/}
                <CartList products={order.orderItems} />
            </Grid>
            <Grid item xs={12} sm={5} >
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2'>Resumen ({ order.numberOfItems } { order.numberOfItems > 1 ? 'productos': 'producto'})</Typography>
                        <Divider sx={{ my:1 }} />
                        <Box display={'flex'} justifyContent='space-between'>
                        <Typography variant='subtitle1'>Dirección de entrega</Typography>
                        </Box>
                        <Typography>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</Typography>
                        <Typography>{ shippingAddress.address } { shippingAddress.address2 ? `, ${ shippingAddress.address2 }`: '' }</Typography>
                        <Typography>{ shippingAddress.city }, { shippingAddress.zip }</Typography>
                        <Typography>{ shippingAddress.country }</Typography>
                        <Typography>{ shippingAddress.phone }</Typography>
                        <Divider  />
                        {/*OrderSummary*/}
                        <OrderSummary 
                            orderValues={{
                                numberOfItems: order.numberOfItems,
                                subTotal: order.subTotal,
                                total: order.total,
                                tax: order.tax,
                            }} 
                        />
                        <Box sx={{ mt:3 }}>
                            {/*Circular Progress */}
                            <Box 
                                display={'flex'} 
                                justifyContent='center' 
                                className='fadeIn'
                                sx={{ display: isPaying ? 'flex': 'none' }}
                            >
                                <CircularProgress color="success"/>
                            </Box>
                            
                            <Box flexDirection='column' sx={{ display: isPaying ? 'none': 'flex', flex: 1 }} >
                            {
                                order.isPaid
                                ? (
                                    <Chip 
                                        sx={{ my: 2 }}
                                        label="Orden ya fue pagada"
                                        variant='outlined'
                                        color="success"
                                        icon={ <CreditCardOutlinedIcon /> }
                                    />

                                ):(
                                <PayPalButtons
                                    createOrder={(data, actions) => {
                                        
                                        return actions.order.create({
                                            purchase_units: [
                                                {
                                                    amount: {
                                                        value: `${order.total}`,
                                                    },
                                                },
                                            ],
                                        });
                                    }}
                                    onApprove={(data, actions) => {
                                        return actions.order!.capture().then((details) => {
                                            onOrderCompleted(details)
                                        });
                                    }}
                                />
                                )
                            }
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    const { id = '' } = query;
    const session:any = await getSession({ req });

    if(!session){
        return {
            redirect:{
                destination:`/auth/login/p=/orders/${id}`,
                permanent: false
            }
        }
    }

    const order = await dbOrders.getOrderById(id.toString());
    if(!order){
        return {
            redirect:{
                destination:`/orders/history`,
                permanent: false
            }
        }
    }

    /*Validar que la orden le pertenezca al usuario */
     if(order.user !== session.user._id){
        return {
            redirect:{
                destination:`/orders/history`,
                permanent: false
            }
        }
    } 

    return {
        props: {
            order
        }
    }
}

export default OrderPage