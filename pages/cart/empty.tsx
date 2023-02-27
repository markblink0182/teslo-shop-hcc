import { PropsWithChildren, } from 'react'
import NextLink from 'next/link';
import { ShopLayout } from '@/components/layouts';
import { Box, Typography, Link } from '@mui/material'
import RemoveShoppingCartOutlinedIcon from '@mui/icons-material/RemoveShoppingCartOutlined';

interface Props{
    title?:String
}

const EmptyPage = () => {
  return (
    <ShopLayout title='Carrito vacio' pageDescription="No hay articulos en el carrito.">
        <Box
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            height='calc(100vh-200px)'
            sx={{ flexDirection:{ xs:'column', sm:'row' } }}
        >
        <RemoveShoppingCartOutlinedIcon sx={{ fontSize:90}}/>
        <Box display='flex' flexDirection='column' alignItems='center'>
            <Typography marginLeft={2}>Su carrito está vacío</Typography>
            <NextLink href='/' passHref legacyBehavior>
                <Link typography='h6' color='secondary'>Regresar</Link>
            </NextLink>
        </Box> 
        </Box>
    </ShopLayout>
  )
}

export default EmptyPage