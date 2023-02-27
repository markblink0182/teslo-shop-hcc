import { useContext, useState } from 'react'
import { UIContext, CartContext } from '@/context';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { AppBar,  Toolbar, Typography, Link, Box, Button, IconButton, Badge,Input, InputAdornment  } from '@mui/material';
import { SearchOutlined, ShoppingCartOutlined,ClearOutlined} from '@mui/icons-material';

export const Navbar = () => {
  const  { pathname, asPath } = useRouter();
  const { toogleSideMenu} = useContext(UIContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const { numberOfItems } = useContext( CartContext );

    /*Busqueda */
    const router = useRouter();

    const onSearchTerm = ()=>{
        if (searchTerm.trim().length === 0) return;
        router.push(`/search/${searchTerm}`)
    }

  

  return (
    <AppBar>
        <Toolbar>
          <NextLink href="/" passHref legacyBehavior>
            <Link display='flex'alignItems="center">
              <Typography variant='h6'>Teslo |</Typography>
              <Typography sx={{ ml: 0.2}}>Shop</Typography>
            </Link>
          </NextLink>
          
          <Box flex={1}/>
            <Box className='fadeIn' sx={{ display: isSearchVisible ? 'none': { xs:'none', sm:'block'  } }}>
              <NextLink href="/category/men" passHref legacyBehavior>
                <Link>
                  <Button color= {asPath ==='/category/men'? 'primary': 'info'}>Hombres</Button>
                </Link>
              </NextLink>
              <NextLink href="/category/women" passHref legacyBehavior>
                <Link>
                  <Button color= {asPath ==='/category/women'? 'primary': 'info'}>Mujeres</Button>
                </Link>
              </NextLink>
              <NextLink href="/category/kid" passHref legacyBehavior>
                <Link>
                  <Button color= {asPath ==='/category/kid'? 'primary': 'info'}>Niños</Button>
                </Link>
              </NextLink>
            </Box>
          
            <Box flex={1}/>
            {/*Pantallas grandes */}
            {
              isSearchVisible
              ?(
                <Input
                className='fadeIn'
                sx={{ display: { xs:'none', sm:'flex'  } }}
                  autoFocus
                  value={searchTerm}
                  onChange={(e)=>setSearchTerm(e.target.value)}
                  onKeyPress={(e)=>e.key ==='Enter' ? onSearchTerm() : null}
                  type='text'
                  placeholder="Buscar..."
                  endAdornment={
                      <InputAdornment position="end">
                          <IconButton
                              onClick={()=>setIsSearchVisible(false)}
                          >
                          <ClearOutlined />
                          </IconButton>
                      </InputAdornment>
                  }
                />
              )
              :(
                <IconButton
                  onClick={()=>setIsSearchVisible(true)}
                  className='fadeIn'
                  sx={{ display:{ xs:'none', sm:'flex'  }}}
                  >
                  <SearchOutlined />
                </IconButton >
              )
            }

            
            {/*Pantallas pequeñas */}
            <IconButton
              sx={{ display:{ xs:'flex', sm:'none'  }}} 
              onClick={toogleSideMenu}
              >
              <SearchOutlined />
            </IconButton >

            <NextLink href="/cart" passHref legacyBehavior>
              <Link>
              <Badge badgeContent={ numberOfItems > 9 ? '+9': numberOfItems  } color="secondary">
                  <ShoppingCartOutlined />
                </Badge>
              </Link>
            </NextLink>
            <Button onClick={toogleSideMenu}>
              Menú
            </Button>

        </Toolbar>
    </AppBar>
  )
}
