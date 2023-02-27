import { useState, useContext, useEffect} from 'react';
import { AuthContext } from '@/context';
import { useForm, SubmitHandler } from "react-hook-form";
import NextLink from 'next/link';
import { AuthLayout } from '@/components/layouts';
import { Typography, Grid, Link, CardContent, Divider, Box, Button, TextField, Chip } from '@mui/material';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { validations } from '@/utils';
import { useRouter } from 'next/router';
import { getSession, signIn, getProviders  } from 'next-auth/react';
import { GetServerSideProps } from 'next'

type Inputs = {
    email: string,
    password: string,
  };

const LoginPage = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
    const [showError, setShowError] = useState(false);
    const { loginUser} = useContext(AuthContext);
    const router = useRouter();
    const [providers, setProviders] = useState<any>({});

    useEffect(() => {
      getProviders().then( prov => {
         console.log({prov});
        setProviders(prov)
      })
    }, [])

    const onLoginUser = async ({email,password}: Inputs)=>{
        setShowError(false);
        await signIn('credentials',{ email, password })
        /* Codigo viejo */
/*         const isValidLogin = await loginUser(email,password);

        if(!isValidLogin){
            setShowError(true)
            setTimeout(() => setShowError(false) , 3000);
            return;
        }
        
        const destination = router.query.p?.toString() || '/';
        router.replace(destination);
        */
    } 

  return (
    <AuthLayout title='Iniciar sesión'>
        <form
            onSubmit={handleSubmit(onLoginUser)}
            noValidate
        >
        <Box sx={{ width: 450, padding:'10px 20px' }}>
            <Grid container spacing={2}>
                <Grid item xs={12} >
                    <Typography variant='h1' component={'h1'}>Iniciar sesión</Typography>
  <p className="text-sm font-medium text-red-700">Hello mark</p>

                    <Chip 
                        label='Email / Contraseña no encontrados'
                        color='error'
                        icon={<ErrorOutlineOutlinedIcon />}
                        className='fadeIn'
                        sx={{ display: showError ? 'flex': 'none' }}
                    />
                </Grid>
                <Grid item xs={12}>
                <h1 className="text-3xl font-bold underline text-blue-900">
      Hello world!
    </h1>
                    <TextField 
                        {...register('email',
                            {
                              required: 'Este campo es requerido.',
                              validate: validations.isEmail  //(val)=>validations.isEmail(val)                                  
                            })   
                        }
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        label='Correo'
                        variant='outlined'
                        fullWidth 
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        {...register('password',
                            {
                                required: 'Este campo es requerido.',
                                minLength: {value:6, message: 'Minimo 6 caracteres'}                                    
                            })   
                        }
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        label='Contraseña'
                        type={'password'}
                        variant='outlined'
                        fullWidth 
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button 
                    type='submit'
                    color='secondary'
                    className='circular-btn'
                    size='large'
                    fullWidth
                    disabled={showError ? true: false}
                    >
                        Ingresar
                    </Button>
                </Grid>
                <Grid item xs={12} display='flex' justifyContent='end'>
                    <NextLink 
                        href={ router.query.p ? `/auth/register?p=${ router.query.p }`: '/auth/register' } 
                        passHref
                        legacyBehavior
                        >
                        <Link underline='always'>
                            ¿No tienes cuenta?
                        </Link>
                    </NextLink>
                </Grid>
                <Grid item xs={12} display='flex' flexDirection='column' justifyContent='end'>
                            <Divider sx={{ width: '100%', mb: 2 }} />
                            {
                                Object.values( providers ).map(( provider: any ) => {
                                    
                                    if ( provider.id === 'credentials' ) return (<div key="credentials"></div>);
                                    return (
                                        <Button
                                            key={ provider.id }
                                            variant="outlined"
                                            fullWidth
                                            color="primary"
                                            sx={{ mb: 1 }}
                                            onClick={ () => signIn( provider.id ) }
                                        >
                                            { provider.name }
                                        </Button>
                                    )
                                })
                            }
                        </Grid>
            </Grid>
        </Box>
        </form>
    </AuthLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    const session = await getSession({ req })

    const { p = '/' }= query;

    if(session){
        return {
            redirect:{
                destination: p.toString(),
                permanent: false
            }
        }
    }

    return {
        props: {
            
        }
    }
}

export default LoginPage