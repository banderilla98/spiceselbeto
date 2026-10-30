
export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  weight: string;
  category: string;
  image: string;
  featured: boolean;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Golden Turmeric",
    slug: "golden-turmeric",
    description: "Earthy, aromatic turmeric with a rich golden color.",
    price: 5.99,
    weight: "100g",
    category: "Ground Spices",
    image:
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=900&q=85",
    featured: true,
  },
  {
    id: 2,
    name: "Smoked Paprika",
    slug: "smoked-paprika",
    description: "A deep, smoky flavor perfect for everyday cooking.",
    price: 6.99,
    weight: "100g",
    category: "Ground Spices",
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=85",
    featured: true,
  },
  {
    id: 3,
    name: "Premium Cinnamon",
    slug: "premium-cinnamon",
    description: "Warm and aromatic cinnamon for sweet and savory recipes.",
    price: 5.49,
    weight: "100g",
    category: "Whole Spices",
    image:
      "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=900&q=85",
    featured: true,
  },
  {
    id: 4,
    name: "Ground Cumin",
    slug: "ground-cumin",
    description: "A bold, earthy spice that brings depth to your dishes.",
    price: 4.99,
    weight: "100g",
    category: "Ground Spices",
    image:
      "https://images.unsplash.com/photo-1603909223429-69bb7101f420?auto=format&fit=crop&w=900&q=85",
    featured: true,
  },
];
