import { Typography, Grid, Card, CardActionArea, CardMedia, Box, Link, Chip } from "@mui/material";
import { IProduct } from '@/interfaces';
import { FC, useState, useMemo } from 'react';
import NextLink from "next/link";

interface Props{
    product:IProduct // no se pone como arreglo porque solo es 1
}

export const ProductCard:FC<Props> = ({ product }) => {
    const [isHovered, setIshovered] = useState(false);

    const productImage = useMemo(() => {
        return isHovered ? product.images[1]
                        : product.images[0]
    }, [isHovered, product.images]);

    const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <Grid 
        onMouseEnter={()=>setIshovered(true)}
        onMouseLeave={()=>setIshovered(false)}
        item xs={6} sm={4}>
    <Card>
        <NextLink href={`/product/${product.slug}`} passHref prefetch={false} legacyBehavior>
            <Link>
            <CardActionArea>
                {
                    (product.inStock === 0) && (
                        <Chip
                            color="primary"
                            label='No hay disponibles'
                            sx={{ position:'absolute', zIndex:99, top:'10px', left:'10px' }}
                        /> 
                    )
                }
                <CardMedia
                component="img"
                image={productImage}
                alt={product.title}
                className="fadeIn"
                onLoad={()=>setIsImageLoaded(true)}
                />
            </CardActionArea> 
            </Link>     
        </NextLink>
    </Card>
    <Box sx={{ mt: 1, display: isImageLoaded ? 'block': 'none' }} className="fadeIn">
        <Typography fontWeight={700}>{ product.title }</Typography>
        <Typography fontWeight={500}>${ product.price }</Typography>
    </Box>
  </Grid>
  )
}
