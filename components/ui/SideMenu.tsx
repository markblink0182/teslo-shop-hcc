import { Link, Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import { FeaturedPlayListOutlined,AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined } from "@mui/icons-material"
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import { useContext, useState} from "react";
import { UIContext, AuthContext } from "@/context";
import { useRouter } from "next/router";


export const SideMenu = () => {
    const router = useRouter();
    const { isMenuOpen, toogleSideMenu} = useContext(UIContext);
    const { isLoggedIn, user, logout } = useContext(AuthContext)
    const [searchTerm, setSearchTerm] = useState('');

    /*Busqueda */
    const onSearchTerm = ()=>{
        if (searchTerm.trim().length === 0) return;
        navigateTo(`/search/${searchTerm}`);
    }

    const navigateTo = (url:string)=>{
        toogleSideMenu()
        router.push(url)
    }


  return (
    <Drawer
        open={ isMenuOpen }
        onClose={toogleSideMenu}
        anchor='right'
        sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
    >
        <Box sx={{ width: 250, paddingTop: 5 }}>
            
            <List>

                <ListItem>
                    <Input
                        autoFocus
                        value={searchTerm}
                        onChange={(e)=>setSearchTerm(e.target.value)}
                        onKeyPress={(e)=>e.key ==='Enter' ? onSearchTerm() : null}
                        type='text'
                        placeholder="Buscar..."
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={onSearchTerm}
                                >
                                 <SearchOutlined />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </ListItem>
            {
                isLoggedIn && (
                    <>
                        <ListItem 
                        button
                        >
                            <ListItemIcon>
                                <AccountCircleOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Perfil'} />
                        </ListItem>
                        <ListItem button onClick={ ()=>navigateTo('/orders/history') }>
                            <ListItemIcon>
                                <ConfirmationNumberOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Mis Ordenes'} />
                        </ListItem>
                    </>
                )
            }
    
                <ListItem 
                onClick={()=>navigateTo('/category/men')}
                button sx={{ display: { xs: '', sm: 'none' } }}>
                    <ListItemIcon>
                        <MaleOutlined/>
                    </ListItemIcon>
                            <ListItemText primary={'Hombres'} />
                </ListItem>

                <ListItem 
                onClick={()=>navigateTo('/category/women')}
                button sx={{ display: { xs: '', sm: 'none' } }}>
                    <ListItemIcon>
                        <FemaleOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Mujeres'} />
                </ListItem>

                <ListItem 
                onClick={()=>navigateTo('/category/kid')}
                button sx={{ display: { xs: '', sm: 'none' } }}>
                    <ListItemIcon>
                        <EscalatorWarningOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Niños'} />
                </ListItem>

            {
                isLoggedIn
                ?(
                    <ListItem button onClick={ logout} >
                        <ListItemIcon>
                            <LoginOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Salir'} />
                    </ListItem>
                )
                :(
                    <ListItem button onClick={ () => navigateTo(`/auth/login?p=${ router.asPath }`) }>
                        <ListItemIcon>
                            <VpnKeyOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Ingresar'} />
                    </ListItem>
                )
            }
        
                {/* Admin */}
                {
                    user?.role === 'admin' && (
                        <>
                            <Divider />
                            <ListSubheader>Admin Panel</ListSubheader>

                            <ListItem button onClick={ () => navigateTo(`/admin`) }>
                                <ListItemIcon>
                                    <GridViewOutlinedIcon/>
                                </ListItemIcon>
                                <ListItemText primary={'Dashboard'} />
                            </ListItem>
                            <ListItem button onClick={ () => navigateTo(`/admin/products`) }>
                                <ListItemIcon>
                                    <ConfirmationNumberOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Productos'} />
                            </ListItem>
                            <ListItem button onClick={ () => navigateTo(`/admin/orders`) }>
                                <ListItemIcon>
                                    <FeaturedPlayListOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Ordenes'} />
                            </ListItem>

                            <ListItem button onClick={ () => navigateTo(`/admin/users`) }>
                                <ListItemIcon>
                                    <AdminPanelSettings/>
                                </ListItemIcon>
                                <ListItemText primary={'Usuarios'} />
                            </ListItem>
                        </>
                    )
                }
            </List>
        </Box>
    </Drawer>
  )
}