import { SearchResponse } from '@/types/ui/combobox';

const mockDelay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

export const searchProductsByName = async (query: string) => {
    const data: SearchResponse = await fetch(`https://dummyjson.com/products/search?q=${query}`).then(e => e.json())
    return data

};
