import useSWR from 'swr'
import { SWRConfiguration } from 'swr/_internal';
import { IProduct } from '@/interfaces';

const fetcher = (...args:[key:string]) => fetch(...args).then((res) => res.json())

export const useProducts = (url: string, config:SWRConfiguration={})=>{
   // const { data, error } = useSWR<IProduct[]>(`/api${url}`, fetcher, config);
    const { data, error } = useSWR<IProduct[]>(`/api${url}`, config);

    return {
        products: data || [],
        isLoading: !error && !data,
        isError: error
    }
}