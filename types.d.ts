export interface Watch {
    id: string;
    name: string;
    brand: string;
    category: string;
    rating: number;
    price: number;
    cost: number;
    availableStock: number;
    description: string;
    imageUrl: string;
    summary: string;
    videoUrl: string;
    createdAt?: Date | string;
    userId?: string;
}

export interface AuthCredentials{
    fullName: string;
    email: string;
    password: string;
}

export interface WatchParams{
    name: string;
    brand: string;
    category: string;
    rating: number;
    price: number;
    availableStock: number;
    description: string;
    imageUrl: string;
    summary: string;
    videoUrl:string;
}