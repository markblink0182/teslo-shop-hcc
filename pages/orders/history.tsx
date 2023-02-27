import NextLink from 'next/link';
import { FC, PropsWithChildren } from 'react';
import { ShopLayout } from '@/components/layouts';
import { Typography, Grid, Card, CardContent, Divider, Box, Button, Link, Chip } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react';
import { IOrder } from '../../interfaces/order';
import { dbOrders } from '@/database';

interface Props{
    orders:IOrder[]
}

const columns:GridColDef[] = [
    {field: 'id', headerName: 'ID', width: 100},
    {field: 'fullName', headerName: 'Nombre completo', width: 300},
    {
        field: 'paid',
        headerName: 'Pagada',
        width: 200,
        renderCell: (params)=>{
            return (
                params.row.paid
                ?<Chip color='success' label='Pagada' variant='outlined'/>
                :<Chip color='error' label='No pagada' variant='outlined'/>
            )
        }
    },
    {
        field: 'orden',
        headerName: 'Ver orden',
        sortable:false,
        width: 200,
        renderCell: (params)=>{
            return (
                <NextLink href={`/orders/${params.row.orderId}`} passHref legacyBehavior>
                    <Link underline='always'>Ver orden</Link>
                </NextLink>
            )
            }        
    },
    
];

const HistoryPage:FC<PropsWithChildren<Props>> = ({ orders }) => {
    const rows = orders.map((order, id)=>({
        id: id + 1,
        paid: order.isPaid,
        fullName: `${ order.shippingAddress.firstName } ${ order.shippingAddress.lastName }`,
        orderId: order._id
    }))

  return (
    <ShopLayout title='Historial de ordenes.' pageDescription='Historial de órdenes del cliente.'>
        <Typography variant='h1' component={'h1'}>Historial de órdenes</Typography>
        <Grid container className='fadeIn'>
            <Grid item xs={12} sx={{ height:650, width:'100%' }}>
                <DataGrid 
                    rows={rows}
                    columns={ columns }
                    pageSize={ 10 }
                    rowsPerPageOptions={[10]}
                />
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const session:any = await getSession({ req });

    if ( !session ) {
        return {
            redirect: {
                destination: '/auth/login?p=/orders/history',
                permanent: false,
            }
        }
    }

    const orders = await dbOrders.getOrdersByUser( session.user._id );


    return {
        props: {
            orders
        }
    }
}

export default HistoryPage