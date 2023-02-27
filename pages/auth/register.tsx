import { useState, useContext} from 'react';
import { GetServerSideProps } from 'next'
import { AuthContext } from '@/context';
import NextLink from 'next/link';
import { AuthLayout } from '@/components/layouts';
import { useRouter } from 'next/router';
import { Typography, Grid, Link, Chip, Divider, Box, Button, TextField } from '@mui/material';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { signIn, getSession } from 'next-auth/react';
import { useForm, SubmitHandler } from "react-hook-form";
import { validations } from '@/utils';

type Inputs = {
    name: string,
    email: string,
    password: string,
  };

const RegisterPage = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const router = useRouter();
    const { registerUser } = useContext(AuthContext);

    const onRegisterForm = async ({name, email,password}: Inputs)=>{
        setShowError(false);

        const { hasError, message } = await registerUser(name, email,password);

        if(hasError){
            setShowError(true);
            setErrorMessage(message!)
            setTimeout(() => setShowError(false) , 3000);
            return;
        }

         // Navegar a la pantalla que el usuario estaba
/*          const destination = router.query.p?.toString() || '/';
         router.replace(destination); */
         await signIn('credentials', {email, password})
    }


  return (
    <AuthLayout title='Registrarse'>
        <form
            onSubmit={handleSubmit(onRegisterForm)}
            noValidate
        >
        <Box sx={{ width: 450, padding:'10px 20px' }}>
            <Grid container spacing={2}>
                <Grid item xs={12} >
                    <Typography variant='h1' component={'h1'}>Registrarse</Typography>
                    <Chip 
                        label='Usuario existente.'
                        color='error'
                        icon={<ErrorOutlineOutlinedIcon />}
                        className='fadeIn'
                        sx={{ display: showError ? 'flex': 'none' }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        {...register('name',
                        {
                            required: 'Este campo es requerido.',
                            minLength: {value:3, message: 'Minimo 3 caracteres'}                                    
                        })   
                    }
                    error={!!errors.name}
                    helperText={errors.name?.message}
                        label='Nombre'
                        variant='outlined'
                        fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        {...register('email',
                        {
                          required: 'Este campo es requerido.',
                          validate: validations.isEmail  //(val)=>validations.isEmail(val)                                  
                        })   
                    }
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        type='email'
                        label='Correo'
                        variant='outlined'
                        fullWidth />
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
                        fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        type='submit'
                        disabled={showError ? true: false}
                        color='secondary'
                        className='circular-btn'
                        size='large'
                        fullWidth>
                        Registrarse
                    </Button>
                </Grid>
                <Grid item xs={12} display='flex' justifyContent={'end'}>
                    <NextLink href={ router.query.p ? `/auth/login?p=${ router.query.p }`: '/auth/login' } passHref>
                        <Link underline='always'>Ya tienes cuenta?</Link>
                    </NextLink>
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

export default RegisterPage