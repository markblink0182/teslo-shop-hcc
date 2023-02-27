import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/database';
import Product from '@/models/Product';
import { IProduct } from '@/interfaces';

type Data = 
| { message: string }
| IProduct;

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    switch ( req.method ) {
        case 'GET':
            return getProduct( req, res );
        default:
            return res.status(400).json({ message: 'Método no existe ' + req.method });
    }
}

const getProduct = async( req: NextApiRequest, res: NextApiResponse ) => {
    
    const { slug } = req.query;

    await db.connect();
    const productInDB = await Product.findOne( {slug} ).select('-_id');
    await db.disconnect();

    if ( !productInDB ) {
        return res.status(400).json({ message: 'No hay entrada con ese ID: ' + slug })
    }

    productInDB.images = productInDB.images.map( image  => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME}products/${ image }`
        });
    return res.status(200).json( productInDB );
}