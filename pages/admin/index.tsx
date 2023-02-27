import {useState, useEffect} from 'react'
import { AdminLayout } from '@/components/layouts'
import {AccessTimeOutlined,ProductionQuantityLimitsOutlined,DashboardOutlined, CreditCardOutlined, AttachMoneyOutlined,CreditCardOffOutlined,GroupOutlined,CategoryOutlined,CancelPresentationOutlined} from '@mui/icons-material';
import { Grid, Typography } from '@mui/material'
import { SummaryTile } from '@/components/admin/SummaryTile';
import { DashBoardSummaryResponse } from '@/interfaces';
import useSWR from 'swr';


const DashboardPage = () => {
  const [refreshIn, setRefreshIn] = useState(59);

  const { data, error } = useSWR<DashBoardSummaryResponse>('/api/admin/dashboard', {
    refreshInterval: 59 * 10000 // 30 segundos
  });

  useEffect(() => {
    const interval = setInterval(()=>{
      console.log('Tick');
      setRefreshIn( refreshIn => refreshIn > 0 ? refreshIn - 1: 30 );
    }, 1000 );
  
    return () => clearInterval(interval)
  }, []);


  if ( !error && !data ) {
    return <></>
  }

  if ( error ){
    console.log(error);
    return <Typography>Error al cargar la información</Typography>
  }

  const {
    numberOfOrders,
    paidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
    notPaidOrders,
  } = data!;



  return (
    <AdminLayout
        title='Dashboard'
        subTitle= 'Estadisticas generales'
        icon={ <DashboardOutlined />}
    >
     <Grid container spacing={2}>
            
            <SummaryTile 
                title={ numberOfOrders }
                subTitle="Ordenes totales"
                icon={ <CreditCardOutlined color="secondary" sx={{ fontSize: 40 }} /> }
            />

            <SummaryTile 
                title={ paidOrders }
                subTitle="Ordenes pagadas"
                icon={ <AttachMoneyOutlined color="success" sx={{ fontSize: 40 }} /> }
            />

            <SummaryTile 
                title={ notPaidOrders }
                subTitle="Ordenes pendientes"
                icon={ <CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} /> }
            />

            <SummaryTile 
                title={ numberOfClients }
                subTitle="Clientes"
                icon={ <GroupOutlined color="primary" sx={{ fontSize: 40 }} /> }
            />

            <SummaryTile 
                title={ numberOfProducts }
                subTitle="Productos"
                icon={ <CategoryOutlined color="warning" sx={{ fontSize: 40 }} /> }
            />

            <SummaryTile 
                title={ productsWithNoInventory }
                subTitle="Sin existencias"
                icon={ <CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} /> }
            />

            <SummaryTile 
                title={ lowInventory }
                subTitle="Bajo inventario"
                icon={ <ProductionQuantityLimitsOutlined color="warning" sx={{ fontSize: 40 }} /> }
            />

            <SummaryTile 
                title={ refreshIn }
                subTitle="Actualización en:"
                icon={ <AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} /> }
            />

        </Grid>

    </AdminLayout>
  )
}

export default DashboardPage