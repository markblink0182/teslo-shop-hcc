import { ShopLayout } from "@/components/layouts";
import { Typography } from "@mui/material";
import { ProductList } from "@/components/products";
import { useProducts } from '@/hooks';
import { FullScreenLoading } from "@/components/ui";

const KidsPage = () => {
    const { products, isLoading } = useProducts('/products?gender=kid');

  return (
    <ShopLayout title={'Teslo-shop Kids'} pageDescription={'Enuentra los mejores productos de Teslo para niños.'}>
    <Typography variant="h1" component="h1">Niños</Typography>
    <Typography variant="h2" sx={{ mb:1 }}>Productos de niño</Typography>
    {
      isLoading
      ?<FullScreenLoading />
      :<ProductList products={ products } />
    }
      
  </ShopLayout>
  )
}

export default KidsPage;