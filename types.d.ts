interface Watch {
    id: number;
    name: string;
    brand: string;
    category: string;
    rating: number;
    price: number;
    availableStock: number;
    description: string;
    colorTheme: string;
    imageUrl: string;
    summary: string;
    videoUrl:string;
}

interface AuthCredentials{
    fullName: string;
    email: string;
    password: string;
}