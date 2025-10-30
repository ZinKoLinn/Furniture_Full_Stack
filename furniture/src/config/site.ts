const links = {
  x: "https://twitter.com/sample",
  github: "https://github.com/sample/furniture",
  githubAccount: "https://github.com/sample",
  discord: "https://discord.com/users/sample",
};

export const siteConfig = {
  name: "Furniture Shop",
  description: "A Furniture Shop build with react router",
  mainNav: [
    {
      title: "Produts",
      card: [
        {
          title: "Wooden",
          href: "/products?categories=2",
          description: "comfortabale with Wooden furniture.",
        },
        {
          title: "Bamboo",
          href: "/products?categories=3",
          description: "Build your own Bamboo furniture.",
        },
        {
          title: "Metal",
          href: "/products?categories=4",
          description: "Buy our latest metal furniture.",
        },
      ],
      menu: [
        {
          title: "Services",
          href: "services",
        },
        {
          title: "Blog",
          href: "blogs",
        },
        {
          title: "About us",
          href: "about",
        },
      ],
    },
  ],
  footerNav: [
    {
      title: "Furniture Types",
      items: [
        {
          title: "Seating",
          href: "/products?types=2",
          external: true,
        },
        {
          title: "Lying",
          href: "/products?types=3",
          external: true,
        },
        {
          title: "Entertainment",
          href: "/products?types=4",
          external: true,
        },
        {
          title: "Tables",
          href: "/products?types=5",
          external: true,
        },
        {
          title: "Storage",
          href: "/products?types=6",
          external: true,
        },
      ],
    },
    {
      title: "Help",
      items: [
        {
          title: "About",
          href: "/about",
          external: false,
        },
        {
          title: "Contact",
          href: "/contact",
          external: false,
        },
        {
          title: "Terms",
          href: "/terms",
          external: false,
        },
        {
          title: "Pravicy",
          href: "/pravicy",
          external: false,
        },
      ],
    },
    {
      title: "Social",
      items: [
        {
          title: "X",
          href: links.x,
          external: true,
        },
        {
          title: "Github",
          href: links.githubAccount,
          external: true,
        },
        {
          title: "Discord",
          href: links.discord,
          external: true,
        },
      ],
    },
    {
      title: "Partner",
      items: [
        {
          title: "Shoppy",
          href: "https://shoppy.com",
          external: true,
        },
        {
          title: "Poppy",
          href: "https://poppy.com",
          external: true,
        },
        {
          title: "Talkie",
          href: "https://talkie.com",
          external: true,
        },
        {
          title: "coffee",
          href: "https://coffee.com",
          external: true,
        },
      ],
    },
  ],
};
