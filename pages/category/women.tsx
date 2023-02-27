import { ShopLayout } from "@/components/layouts";
import { Typography } from "@mui/material";
import { ProductList } from "@/components/products";
import { useProducts } from '@/hooks';
import { FullScreenLoading } from "@/components/ui";

const WomenPage = () => {
    const { products, isLoading } = useProducts('/products?gender=women');

  return (
    <ShopLayout title={'Teslo-shop Mujeres'} pageDescription={'Enuentra los mejores productos de Teslo para Mujeres.'}>
    <Typography variant="h1" component="h1">Mujeres</Typography>
    <Typography variant="h2" sx={{ mb:1 }}>Productos de Mujer</Typography>
    {
      isLoading
      ?<FullScreenLoading />
      :<ProductList products={ products } />
    }
      
  </ShopLayout>
  )
}

export default WomenPage;