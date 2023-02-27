import { ShopLayout } from "@/components/layouts";
import { FC, useState, useContext } from 'react';
import { CartContext } from "@/context";
import { Grid, Box, Typography, Button, Chip } from "@mui/material";
import { ProductSlideshow, SizeSelector } from "@/components/products";
import { ItemCounter } from "@/components/ui";
import { IProduct, ICardProduct } from "@/interfaces";
import { GetStaticPaths, GetStaticProps } from 'next'
import { dbProducts } from "@/database";
import { ISize } from '../../interfaces/products';
import { useRouter } from "next/router";

interface Props{
  product:IProduct
}

const ProductPage:FC<Props> = ( { product }  ) => {
  const router = useRouter();
  const { addProductToCard } = useContext(CartContext);

  const [tempCardProduct, setTempCardProduct] = useState<ICardProduct>({
    _id:    product._id,
    images: product.images[0],
    price:  product.price,
    size:   undefined,
    slug:   product.slug,
    title:  product.title,
    gender: product.gender,
    quantity: 1
  });

  const selectedSize=(size:ISize)=>{
    setTempCardProduct(tempCardProduct=>(
      {
        ...tempCardProduct,
        size
      }
    ))
  }

  const onUpdatedQuantity = (newValue:number)=>{
    setTempCardProduct(tempCardProduct=>(
      {
        ...tempCardProduct,
        quantity:newValue
      }
    ))
  }


  const onAddProduct = ()=>{
    if(!tempCardProduct.size) {return}

    addProductToCard(tempCardProduct);
    router.push('/cart')
  }

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <h1 className="text-2xl font-bold underline text-red-900">
      <p className="text-sky-400">The quick brown fox...</p>
    </h1>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          {/* Slide Show */}
          <ProductSlideshow 
            images={product.images}
          /> 
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box display='flex' flexDirection='column'>
            {/*Titulos*/}
            <Typography variant="h1" component="h1">{product.title}</Typography>
            <Typography variant="subtitle1" component="h2">${product.price}</Typography>
            {/* Cantidad */}
            <Box sx={{ my:2 }}>
              <Typography variant="subtitle1" component={'div'}>cantidad</Typography>
              {/* Item counter */}
              <ItemCounter
                currentValue={tempCardProduct.quantity}
                updatedQuantity={onUpdatedQuantity}
                maxValue = {product.inStock > 5 ? 5: product.inStock}
              />
              <SizeSelector
                sizes={product.sizes} 
                selectedSize={tempCardProduct.size}
                onSelectedSize={(size)=>selectedSize(size)}
              />  
            </Box>
            {/* Agregar al carrito */}
            {
              (product.inStock > 0)
              ?(
                <Button
                  color="secondary"
                  className="circular-btn"
                  onClick={onAddProduct}  
                >
                  {
                    tempCardProduct.size
                    ? 'Agregar al carrito'
                    : 'Seleccione una talla'
                  }
                  
                </Button>
              )
              :(
                <Chip label='No hay disponibles' color="error" variant="outlined" />
              )
            }
            {/* Descripcion */}
            <Box sx={{ mt:3 }}>
              <Typography variant="subtitle2">Descripcion</Typography>
              <Typography variant="body2">{ product.description }</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}


export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const  slugs  = await  dbProducts.getAllProductSlugs();

  return {
      paths: slugs.map(({slug})=>({
      params:{slug} 
    })),
    fallback: "blocking"
  }
}

export const getStaticProps: GetStaticProps = async ({params}) => {
  const { slug =''} = params as {slug : string }

  const product = await dbProducts.getProductBySlug(slug);

  if ( !product ) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      product
    },
    revalidate: 86400
  }
}




/* export const getServerSideProps: GetServerSideProps = async ({params}) => {
 
  const { slug } = params as { slug:string }
 
  const product = await dbProducts.getProductBySlug(slug)

  if(!product){
    return {
        redirect:{
            destination: '/',
            permanent: false
        }
    }
}

  return {
    props: {
      product
    }
  }
} */
export default ProductPage