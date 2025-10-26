
export const navigationLinks = [
  {
    href: "/catalog",
    label: "Catalog",
  },
  {
    href: "/brands",
    label: "Brands",
  },
  {
    img: "/icons/user.svg",
    selectedImg: "/icons/user-fill.svg",
    href: "/my-profile",
    label: "My Profile",
  },
  {
    img: "/icons/cart.svg",
    selectedImg: "/icons/cart-fill.svg",
    href: "/cart",
    label: "Cart",
  },
];

export const adminSideBarLinks = [
  {
    img: "/icons/admin/home.svg",
    route: "/admin",
    text: "Dashboard",
  },
  {
    img: "/icons/admin/watch.svg",
    route: "/admin/watches",
    text: "All Watches",
  },
  {
    img: "/icons/admin/add-watch.svg",
    route: "/admin/add-watch",
    text: "Add Watch",
  },
  {
    img: "/icons/admin/orders.svg",
    route: "/admin/orders",
    text: "Orders",
  },
  {
    img: "/icons/admin/users.svg",
    route: "/admin/users",
    text: "Customers",
  },
];

export const FIELD_NAMES = {
  fullname: "Full name",
  email: "Email",
  password: "Password",
};

export const FIELD_TYPES = {
  fullname: "text",
  email: "email",
  password: "password",
};


export const sampleWatches = [
  {
    id: 1,
    name: "Rolex Submariner",
    brand: "Rolex",
    category: "Luxury / Diver",
    rating: 4.9,
    price: 9500,
    totalStock: 15,
    availableStock: 7,
    description:
      "Un ícono entre los relojes de buceo, resistente al agua y con un diseño atemporal.",
    colorTheme: "#1c1f40",
    imageUrl:
      "https://www.mercuriojoyeros.com/wp-content/uploads/2022/10/m126613ln-0002_collection_upright_portrait.jpg",
    summary:
      "El Rolex Submariner es reconocido mundialmente como símbolo de elegancia y robustez en relojería profesional.",
    videoUrl: "/sample-video.mp4",
  },
  {
    id: 2,
    name: "Fossil Grant Chronograph",
    brand: "Fossil",
    category: "Classic / Chronograph",
    rating: 4.5,
    price: 220,
    totalStock: 25,
    availableStock: 13,
    description:
      "Diseño clásico con cronógrafo funcional, correa de cuero y estilo versátil para toda ocasión.",
    colorTheme: "#4a3f35",
    imageUrl:
      "https://fossil.scene7.com/is/image/FossilPartners/FS4736_main?$sfcc_fos_large$",
    summary:
      "El Fossil Grant Chronograph combina lo clásico con lo moderno, ideal para uso diario y ocasiones formales.",
    videoUrl: "/sample-video.mp4",
  },
  {
    id: 3,
    name: "Diesel Mega Chief",
    brand: "Diesel",
    category: "Bold / Fashion",
    rating: 4.3,
    price: 280,
    totalStock: 20,
    availableStock: 10,
    description:
      "Un reloj de gran tamaño y diseño atrevido, perfecto para quienes buscan destacar.",
    colorTheme: "#2b2b2b",
    imageUrl:
      "https://tse2.mm.bing.net/th/id/OIP.wwEbCMYf2C-U-t0UmJbnrwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
    summary:
      "El Diesel Mega Chief es un reloj imponente con detalles robustos y diseño urbano.",
    videoUrl: "/sample-video.mp4",
  },
  {
    id: 4,
    name: "Hugo Boss Grand Prix",
    brand: "Hugo Boss",
    category: "Elegant / Racing",
    rating: 4.7,
    price: 350,
    totalStock: 18,
    availableStock: 9,
    description:
      "Inspirado en el automovilismo, combina líneas deportivas con un acabado elegante.",
    colorTheme: "#202c40",
    imageUrl:
      "https://tse3.mm.bing.net/th/id/OIP.9Q1F7IltUQRsvUx6NraFyAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
    summary:
      "El Hugo Boss Grand Prix aporta sofisticación con un toque deportivo, ideal para un look ejecutivo moderno.",
    videoUrl: "/sample-video.mp4",
  },
  {
    id: 5,
    name: "Fossil Machine",
    brand: "Fossil",
    category: "Industrial / Casual",
    rating: 4.4,
    price: 200,
    totalStock: 22,
    availableStock: 11,
    description:
      "Un diseño industrial con caja de acero y correa robusta, hecho para resistir el día a día.",
    colorTheme: "#3c3c3c",
    imageUrl:
      "https://www.elpalaciodehierro.com/on/demandware.static/-/Sites-palacio-master-catalog/default/dwc6def4a1/images/42312049/large/42312049_x1.jpg",
    summary:
      "El Fossil Machine ofrece un look industrial y versátil, combinando fuerza y estilo casual.",
    videoUrl: "/sample-video.mp4",
  },
];




// Opciones de ordenamiento
export const sorts = [
  {
    value: "oldest",
    label: "Oldest",
  },
  {
    value: "newest",
    label: "Newest",
  },
  {
    value: "available",
    label: "Available",
  },
  {
    value: "highestRated",
    label: "Highest Rated",
  },
  {
    value: "lowestPrice",
    label: "Lowest Price",
  },
  {
    value: "highestPrice",
    label: "Highest Price",
  },
];

// Roles de usuario
export const userRoles = [
  {
    value: "user",
    label: "Customer",
    bgColor: "bg-[#FDF2FA]",
    textColor: "text-[#C11574]",
  },
  {
    value: "admin",
    label: "Admin",
    bgColor: "bg-[#ECFDF3]",
    textColor: "text-[#027A48]",
  },
];

// Estados de orden (en vez de borrowed/returned)
export const orderStatuses = [
  {
    value: "pending",
    label: "Pending",
    bgColor: "bg-[#FFF1F3]",
    textColor: "text-[#C01048]",
  },
  {
    value: "shipped",
    label: "Shipped",
    bgColor: "bg-[#F9F5FF]",
    textColor: "text-[#6941C6]",
  },
  {
    value: "delivered",
    label: "Delivered",
    bgColor: "bg-[#F0F9FF]",
    textColor: "text-[#026AA2]",
  },
];

