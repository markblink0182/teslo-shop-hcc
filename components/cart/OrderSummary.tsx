import { useContext, FC, PropsWithChildren } from 'react';
import { CartContext } from '@/context';
import { currency  } from '../../utils'
import { Grid, Box, Typography } from '@mui/material';

interface Props {
    orderValues?: {
        numberOfItems: number;
        subTotal: number;
        total: number;
        tax: number;
    }
}


export const OrderSummary:FC<PropsWithChildren<Props>> = ({ orderValues }) => {
    const { numberOfItems, subTotal, tax, total } = useContext(CartContext)
    const summaryValues = orderValues ? orderValues : { numberOfItems, subTotal, total, tax };
  return (
    <Grid container>
        <Grid item xs={6}>
            <Typography>No. Productos</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>{numberOfItems} { numberOfItems > 1 ? 'productos': 'producto' }</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography>SubTotal</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>{ currency.format(summaryValues.subTotal) }</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography>Impuestos ({ Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100 }%)</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>{ currency.format(summaryValues.tax) }</Typography>
        </Grid>
        <Grid item xs={6} sx={{ mt:2}}>
            <Typography variant='subtitle1'>Total a pagar</Typography>
        </Grid>
        <Grid item xs={6} sx={{ mt:2}} display='flex' justifyContent='end'>
            <Typography variant='subtitle1'>{ currency.format(summaryValues.total) }</Typography>
        </Grid>
    </Grid>
  )
}
