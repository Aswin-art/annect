import { NavItem } from "@/types";

export type User = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: "ADMIN" | "USER" | null;
};

export const users: User[] = [
  {
    id: "1",
    name: "Candice Schiner",
    email: null,
    image: null,
    role: "USER",
  },
  {
    id: "2",
    name: "John Doe",
    email: null,
    image: null,
    role: "ADMIN",
  },
  {
    id: "3",
    name: "Alice Johnson",
    email: null,
    image: null,
    role: "USER",
  },
];

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export const userNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/users",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "Channel",
    href: "/users/channels",
    icon: "channel",
    label: "channel",
  },
  {
    title: "Tickets",
    href: "/users/history-events",
    icon: "historyEvent",
    label: "historyEvent",
  },
  {
    title: "Favorite",
    href: "/users/favorites",
    icon: "favorite",
    label: "favorite",
  },
  {
    title: "Following",
    href: "/users/follows",
    icon: "following",
    label: "follows",
  },
];

export const adminNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "User",
    href: "/admin/users",
    icon: "user",
    label: "user",
  },
  {
    title: "Tag",
    href: "/admin/tags",
    icon: "tag",
    label: "tag",
  },
  {
    title: "Channel",
    href: "/admin/channels",
    icon: "channel",
    label: "channel",
  },
  {
    title: "Event",
    href: "/admin/events",
    icon: "event",
    label: "event",
  },
];

export type Product = {
  id: number;
  name: string;
  price: number;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Americano",
    price: 40000,
  },
  {
    id: 2,
    name: "Expresso",
    price: 20000,
  },
  {
    id: 3,
    name: "Arabica",
    price: 10000,
  },
];
