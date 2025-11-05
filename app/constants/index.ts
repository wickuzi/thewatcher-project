
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
    text: "Panel Admin",
  },
  {
    img: "/icons/admin/watch.svg",
    route: "/admin/watches",
    text: "Relojes",
  },
 

  {
    img: "/icons/admin/users.svg",
    route: "/admin/users",
    text: "Clientes",
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

