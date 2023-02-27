import { FC } from 'react';
import { ISize } from '@/interfaces';
import { Box, Button, Typography } from '@mui/material'

interface Props{
    selectedSize?:ISize;
    sizes:ISize[];

    //Metodos
    onSelectedSize: (size:ISize)=>void;
}

export const SizeSelector:FC<Props> = ({ selectedSize, sizes, onSelectedSize }) => {
  return (
    <Box>
        {
            sizes.map(size =>(
                <Button 
                    onClick={()=>onSelectedSize(size)}
                    key={size} size='small' color={selectedSize === size ? 'primary' : 'info'}>
                    {size}
                </Button>
            ))
        }
    </Box>
  )
}
