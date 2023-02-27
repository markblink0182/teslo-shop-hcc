import { useContext, useEffect} from 'react'
import { CartContext } from '@/context';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { jwt } from '@/utils';
import { useForm } from "react-hook-form";
import Cookies from 'js-cookie';
import { ShopLayout } from '@/components/layouts';
import { countries } from '@/utils';
import { Grid, Box, Typography, TextField, FormControl, Button , Select, MenuItem } from '@mui/material';

type FormData = {
    firstName: string;
    lastName : string;
    address  : string;
    address2?: string;
    zip      : string;
    city     : string;
    country  : string;
    phone    : string;
}

/*Recuperar los datos de las cookies */
const getAddressFromCookies = ():FormData => {
    return {
        firstName : Cookies.get('firstName') || '',
        lastName  : Cookies.get('lastName') || '',
        address   : Cookies.get('address') || '',
        address2  : Cookies.get('address2') || '',
        zip       : Cookies.get('zip') || '',
        city      : Cookies.get('city') || '',
        country   : Cookies.get('country') || '',
        phone     : Cookies.get('phone') || '',
    }
}

const AdressPage = () => {
    const router = useRouter();
    const { updateAddress} = useContext( CartContext );

    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<FormData>(
        {
            defaultValues:{
                firstName: '',
                lastName: '',
                address: '',
                address2: '',
                zip: '',
                city: '',
                country: countries[0].code,
                phone: '',
            }
        }
    );

    useEffect(() => {
      reset(getAddressFromCookies)
    }, [reset])
    

    const onSubmitAddress = ( data: FormData ) => {
        updateAddress( data );
        router.push('/checkout/summary');
    }
    
  return (
    <ShopLayout title='Dirección' pageDescription='Confirmar dirección'>
        <form onSubmit={handleSubmit(onSubmitAddress)} >
        <Typography variant='h1' component='h1'>Dirección</Typography>
        <Grid container spacing={2} sx={{ mt:2 }}>
            <Grid item xs={12} sm={6}>
                <TextField 
                    label='Nombre' 
                    fullWidth
                    {
                        ...register('firstName',{
                            required: 'Este es un campo obligatorio.'
                        })
                    }
                    error={!!errors.firstName}
                    helperText={ errors.firstName?.message }
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    label='Apellido' 
                    fullWidth
                    {
                        ...register('lastName',{
                            required: 'Este es un campo obligatorio.'
                        })
                    }
                    error={!!errors.lastName}
                    helperText={ errors.lastName?.message }
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField 
                    label='Dirección'
                    fullWidth
                    {
                        ...register('address',{
                            required:'Este es un campo obligatorio'
                        })
                    }
                    error={ !! errors.address }
                    helperText = { errors.address?.message }
                    />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField label='Dirección 2 (opcional)' fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField 
                    label='Código Postal'
                    fullWidth 
                    {
                        ...register('zip', {
                            required: 'Este es un campo obligatorio.'
                        })
                    }
                    error={ !!errors.zip }
                    helperText={ errors.zip?.message }
                    />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField 
                    label='Ciudad' 
                    fullWidth
                    {
                        ...register('city', {
                            required: 'Este es un campo obligatorio.'
                        })
                    }
                    error = { !!errors.city }
                    helperText={ errors.city?.message }
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                                    {/* <FormControl fullWidth> */}
                                    <TextField
                            // select
                            variant="filled"
                            label="País"
                            fullWidth
                            // defaultValue={ Cookies.get('country') || countries[0].code }
                            { ...register('country', {
                                required: 'Este campo es requerido'
                            })}
                            error={ !!errors.country }
                            helperText={ errors.country?.message }
                        />
                            {/* {
                                countries.map( country => (
                                    <MenuItem 
                                        key={ country.code }
                                        value={ country.code }
                                    >{ country.name }</MenuItem>
                                ))
                            }
                        </TextField> */}
                    {/* </FormControl> */}
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField 
                    label='Teléfono'
                    fullWidth
                    { ...register('phone', {
                        required: 'Este campo es requerido'
                    })}
                    error={ !!errors.phone }
                    helperText={ errors.phone?.message }
                />
            </Grid>
        </Grid>
        <Box 
            sx={{ mt:4 }} display='flex' justifyContent={'center'}>
            <Button 
                type='submit'
                color='secondary' 
                className='circular-btn' 
                size='large'
            >
                Revisar pedido
            </Button>
        </Box>
        </form>
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
/* export const getServerSideProps: GetServerSideProps = async ({ req }) => {
     const { token = '' } = req.cookies;
     let isValidToken = false;

     try {
         await jwt.isValidToken( token );
         isValidToken = true;
     } catch (error) {
         isValidToken = false;
     }

     if ( !isValidToken ) {
         return {
             redirect: {
                destination: '/auth/login?p=/checkout/address',
                 permanent: false,
            }
         }
     }

     return {
         props: {
            
         }
     }
 }
 */

export default AdressPage