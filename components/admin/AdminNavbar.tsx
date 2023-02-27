import { useContext, useState } from 'react'
import { UIContext } from '@/context';
import NextLink from 'next/link';
import { AppBar,  Toolbar, Typography, Link, Box, Button, IconButton, Badge,Input, InputAdornment  } from '@mui/material';
import { SearchOutlined, ShoppingCartOutlined,ClearOutlined} from '@mui/icons-material';

export const AdminNavbar = () => {
    const { toogleSideMenu } = useContext( UIContext );
    
    return (
        <AppBar>
            <Toolbar>
                <NextLink href='/' passHref legacyBehavior>
                    <Link display='flex' alignItems='center'>
                        <Typography variant='h6'>Teslo |</Typography>
                        <Typography sx={{ ml: 0.5 }}>Shop</Typography>
                    </Link>  
                </NextLink>

                <Box flex={ 1 } />

                <Button onClick={ toogleSideMenu }>
                    Menú
                </Button>

            </Toolbar>
        </AppBar>
    )
}