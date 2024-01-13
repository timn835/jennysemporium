export const PRODUCT_CATEGORIES = [
  {
    label: "Paintings",
    value: "paintings" as const,
    featured: [
      {
        name: "Favorites",
        href: "#",
        imageSrc: "/nav/paintings/picks.jpg",
      },
      {
        name: "Freshly painted",
        href: "#",
        imageSrc: "/nav/paintings/new.jpg",
      },
      {
        name: "Most popular",
        href: "#",
        imageSrc: "/nav/paintings/best-sellers.jpg",
      },
    ],
  },
  {
    label: "Poems",
    value: "poems" as const,
    featured: [
      {
        name: "Editor picks",
        href: "#",
        imageSrc: "/nav/poems/poem-a.jpg",
      },
      {
        name: "New creations",
        href: "#",
        imageSrc: "/nav/poems/poem-b.jpg",
      },
      {
        name: "Best sellers",
        href: "#",
        imageSrc: "/nav/poems/poem-c.jpg",
      },
    ],
  },
];
