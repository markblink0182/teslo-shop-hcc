import { FC, PropsWithChildren} from 'react';
import { Box, IconButton, Typography } from '@mui/material'
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

interface Props{
  currentValue:number,
  maxValue: number,

  //Metodos
  updatedQuantity:(newValue: number)=>void
}

export const ItemCounter:FC<PropsWithChildren<Props>> = ({currentValue,maxValue,updatedQuantity  }) => {

const addOrRemove=(value:number)=>{
  if(value === -1){
    if (currentValue === 1) return;

    return updatedQuantity(currentValue - 1)
  }

  if (currentValue >= maxValue) return;

  updatedQuantity(currentValue + 1)
}

  return (
    <Box display='flex' alignItems='center'>
       <IconButton
        onClick={()=>addOrRemove(-1)}
       >
            <RemoveCircleOutlineOutlinedIcon />
        </IconButton>
        <Typography sx={{ width:40, textAlign:'center' }}>{ currentValue }</Typography>
        <IconButton
          onClick={()=>addOrRemove(+1)}
        >
            <AddCircleOutlineOutlinedIcon />
        </IconButton>
    </Box>
  )
}
