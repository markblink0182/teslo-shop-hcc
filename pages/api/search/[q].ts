import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/database';
import Product from '@/models/Product';
import { IProduct } from '@/interfaces';

type Data = 
    | { message: string }
    | IProduct[]


export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
    switch ( req.method ) {
        case 'GET':
            return searchProducts( req, res );
        default:
            return res.status(400).json({ message: 'Método no existe ' + req.method });
    }
}

const searchProducts = async( req: NextApiRequest, res: NextApiResponse ) => {
    let { q = '' } = req.query;

    if(q.length === 0){
        return res.status(400).json({ message: 'Falta el criterio de busqueda.'})
    }

    q = q.toString().toLowerCase();

    await db.connect();

    const products = await Product.find( {
        $text: { $search: q }
    }).select('title images price inStock slug -_id').lean();

    await db.disconnect();

      return res.status(200).json( products );
}
