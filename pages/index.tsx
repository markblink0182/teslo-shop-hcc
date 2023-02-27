import { ShopLayout } from "@/components/layouts";
import { Typography } from "@mui/material";
import { ProductList } from "@/components/products";
import { useProducts } from '@/hooks';
import { FullScreenLoading } from "@/components/ui";

export default function Home() {

  const { products, isLoading } = useProducts('/products');

  return (
    <ShopLayout title={'Teslo-shop Home'} pageDescription={'Enuentra los mejores productos de Teslo aquí.'}>
      <Typography variant="h1" component="h1">Tienda</Typography>
      <Typography variant="h2" sx={{ mb:1 }}>Todos los productos</Typography>
      {
        isLoading
        ?<FullScreenLoading />
        :<ProductList products={ products } />
      }
        
    </ShopLayout>
          
          
 
  )
}
