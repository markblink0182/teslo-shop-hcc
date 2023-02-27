import { ShopLayout } from "@/components/layouts";
import { Typography, Box } from "@mui/material";
import { ProductList } from "@/components/products";
import { useProducts } from '@/hooks';
import { FullScreenLoading } from "@/components/ui";
import { GetServerSideProps } from 'next';
import { dbProducts } from "@/database";
import { IProduct } from "@/interfaces";
import { FC } from "react";

interface Props{
    products:IProduct[],
    foundProducts: boolean,
    query: string
}


const SearchPage:FC<Props> = ({ products, foundProducts,query })=> {

  return (
    <ShopLayout title={'Teslo-shop Search'} pageDescription={'Enuentra los mejores productos de Teslo aquí.'}>
      <Typography variant="h1" component="h1">Buscar productos</Typography>
      {
        foundProducts
        ?<Typography variant="h2" sx={{ mb:1 }} textTransform='capitalize'>Término { query }</Typography>
        :(
            <Box display={'flex'}>
               <Typography variant="h6" sx={{ mb:2 }}>Sin resultados</Typography>
               <Typography variant="h6" sx={{ ml:2 }} color='secondary' textTransform='capitalize'> { query }</Typography>
            </Box>
        )
      }
        <ProductList products={ products } />
    </ShopLayout>
          
          
 
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {

    const { query ='' }= params as { query: string };


    if ( !query ) {
        return {
          redirect: {
            destination: '/',
            permanent: true
          }
        }
      }

    let products = await dbProducts.getProductsByTerm(query);

    const foundProducts = products.length > 0;

    if(!foundProducts){
        products = await dbProducts.getAllProducts();

    }

    //todo: retornar otros productos

    return {
        props: {
            products,
            foundProducts,
            query
        }
    }
}

export default SearchPage