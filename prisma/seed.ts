import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@houseofsupplements.rs" },
    update: {},
    create: {
      email: "admin@houseofsupplements.rs",
      password: adminPassword,
      name: "Admin",
      role: "ADMIN",
    },
  });
  console.log("✅ Created admin user:", admin.email);

  // Create site settings
  await prisma.siteSettings.upsert({
    where: { id: "settings" },
    update: {},
    create: {
      id: "settings",
      storeName: "House of Supplements",
      storeEmail: "info@houseofsupplements.rs",
      storePhone1: "064/4142-678",
      storePhone2: "065/40-24-444",
      storeAddress1: "Bulevar Oslobođenja 63",
      storeAddress2: "Vojvode Stepe 353",
      freeShippingMin: 4000,
      shippingCost: 350,
      currency: "RSD",
      facebookUrl: "https://facebook.com/houseofsupplements",
      instagramUrl: "https://instagram.com/houseofsupplements",
    },
  });
  console.log("✅ Created site settings");

  // Create brands
  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { slug: "biotech-usa" },
      update: {},
      create: { name: "BioTech USA", slug: "biotech-usa" },
    }),
    prisma.brand.upsert({
      where: { slug: "optimum-nutrition" },
      update: {},
      create: { name: "Optimum Nutrition", slug: "optimum-nutrition" },
    }),
    prisma.brand.upsert({
      where: { slug: "myprotein" },
      update: {},
      create: { name: "MyProtein", slug: "myprotein" },
    }),
    prisma.brand.upsert({
      where: { slug: "ultimate-nutrition" },
      update: {},
      create: { name: "Ultimate Nutrition", slug: "ultimate-nutrition" },
    }),
    prisma.brand.upsert({
      where: { slug: "vemoherb" },
      update: {},
      create: { name: "VemoHerb", slug: "vemoherb" },
    }),
  ]);
  console.log("✅ Created", brands.length, "brands");

  // Create categories
  const proteini = await prisma.category.upsert({
    where: { slug: "proteini" },
    update: {},
    create: {
      name: "Proteini",
      slug: "proteini",
      description:
        "Proteini u prahu postali su popularni među sportistima, bodybuilderima i osobama koje žele da poboljšaju svoju ishranu.",
      order: 1,
    },
  });

  const aminokiseline = await prisma.category.upsert({
    where: { slug: "aminokiseline" },
    update: {},
    create: {
      name: "Aminokiseline",
      slug: "aminokiseline",
      description:
        "Aminokiseline su gradivni blokovi proteina i esencijalne su za oporavak i rast mišića.",
      order: 2,
    },
  });

  const kreatin = await prisma.category.upsert({
    where: { slug: "kreatin" },
    update: {},
    create: {
      name: "Kreatin",
      slug: "kreatin",
      description:
        "Kreatin je jedan od najistraženijih i najefikasnijih suplemenata za povećanje snage i mišićne mase.",
      order: 3,
    },
  });

  const vitamini = await prisma.category.upsert({
    where: { slug: "vitamini" },
    update: {},
    create: {
      name: "Vitamini",
      slug: "vitamini",
      description:
        "Vitamini i minerali su esencijalni za optimalno funkcionisanje organizma.",
      order: 4,
    },
  });

  const preWorkout = await prisma.category.upsert({
    where: { slug: "pre-workout" },
    update: {},
    create: {
      name: "Pre-Workout",
      slug: "pre-workout",
      description:
        "Pre-workout suplementi za maksimalnu energiju i fokus tokom treninga.",
      order: 5,
    },
  });

  // Create subcategories
  await Promise.all([
    prisma.category.upsert({
      where: { slug: "whey-protein" },
      update: {},
      create: {
        name: "Whey Protein",
        slug: "whey-protein",
        parentId: proteini.id,
        order: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "whey-izolat" },
      update: {},
      create: {
        name: "Whey Izolat",
        slug: "whey-izolat",
        parentId: proteini.id,
        order: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: "kazein" },
      update: {},
      create: {
        name: "Kazein",
        slug: "kazein",
        parentId: proteini.id,
        order: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: "bcaa" },
      update: {},
      create: {
        name: "BCAA",
        slug: "bcaa",
        parentId: aminokiseline.id,
        order: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "eaa" },
      update: {},
      create: {
        name: "EAA",
        slug: "eaa",
        parentId: aminokiseline.id,
        order: 2,
      },
    }),
  ]);
  console.log("✅ Created categories and subcategories");

  // Create hero promos
  await Promise.all([
    prisma.heroPromo.create({
      data: {
        title: "VRHUNSKI PROTEINI",
        subtitle: "Novo u ponudi",
        description:
          "Otkrijte našu premium kolekciju whey proteina za maksimalne rezultate u teretani.",
        image:
          "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=1920&q=80",
        buttonText: "Pogledaj ponudu",
        buttonLink: "/kategorija/proteini",
        active: true,
        order: 1,
      },
    }),
    prisma.heroPromo.create({
      data: {
        title: "SPECIJALNA AKCIJA",
        subtitle: "Uštedite do 30%",
        description:
          "Iskoristite posebne popuste na odabrane suplemente. Ponuda traje do isteka zaliha!",
        image:
          "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1920&q=80",
        buttonText: "Vidi akcije",
        buttonLink: "/akcije",
        active: true,
        order: 2,
      },
    }),
    prisma.heroPromo.create({
      data: {
        title: "PLAĆANJE NA RATE",
        subtitle: "Bez kamate",
        description:
          "Podelite plaćanje na do 6 mesečnih rata bez kamate. Visa, Mastercard, Dina.",
        image:
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80",
        buttonText: "Saznaj više",
        buttonLink: "/uslovi-kupovine",
        active: true,
        order: 3,
      },
    }),
  ]);
  console.log("✅ Created hero promos");

  // Create sample products
  const wheyCategory = await prisma.category.findUnique({
    where: { slug: "whey-protein" },
  });

  const bcaaCategory = await prisma.category.findUnique({
    where: { slug: "bcaa" },
  });

  const biotechBrand = brands.find((b) => b.slug === "biotech-usa");

  if (wheyCategory && biotechBrand) {
    const product1 = await prisma.product.create({
      data: {
        name: "100% Pure Whey 2270g",
        slug: "100-pure-whey-2270g",
        description: `<p>100% Pure Whey je visokokvalitetni whey protein koncentrat koji sadrži 78% proteina po porciji.</p>
<h4>Karakteristike:</h4>
<ul>
<li>78% proteina po porciji</li>
<li>Nizak sadržaj masti i ugljenih hidrata</li>
<li>Brza apsorpcija</li>
<li>Odličan ukus</li>
</ul>`,
        shortDesc:
          "Premium whey protein koncentrat sa 78% proteina. Idealan za rast mišića.",
        price: 7250,
        salePrice: 6100,
        sku: "BT-PW-2270",
        stock: 15,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80",
        ]),
        featured: true,
        active: true,
        categoryId: wheyCategory.id,
        brandId: biotechBrand.id,
      },
    });

    // Add variants
    await prisma.productVariant.createMany({
      data: [
        {
          productId: product1.id,
          name: "Ukus",
          value: "Čokolada",
          stock: 5,
        },
        {
          productId: product1.id,
          name: "Ukus",
          value: "Vanila",
          stock: 5,
        },
        {
          productId: product1.id,
          name: "Ukus",
          value: "Jagoda",
          stock: 5,
        },
      ],
    });
  }

  if (bcaaCategory) {
    await prisma.product.create({
      data: {
        name: "BCAA EAA Strong 400g",
        slug: "bcaa-eaa-strong-400g",
        description:
          "<p>Premium BCAA i EAA formula za brži oporavak i rast mišića.</p>",
        shortDesc: "BCAA + EAA formula za optimalan oporavak.",
        price: 2650,
        salePrice: 2300,
        sku: "UN-BCAA-400",
        stock: 8,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=800&q=80",
        ]),
        featured: true,
        active: true,
        categoryId: bcaaCategory.id,
      },
    });
  }

  await prisma.product.create({
    data: {
      name: "Kreatin Monohidrat 500g",
      slug: "kreatin-monohidrat-500g",
      description:
        "<p>Čisti kreatin monohidrat za povećanje snage i mišićne mase.</p>",
      shortDesc: "100% čisti kreatin monohidrat.",
      price: 1850,
      sku: "ON-CR-500",
      stock: 25,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800&q=80",
      ]),
      featured: false,
      active: true,
      categoryId: kreatin.id,
    },
  });

  await prisma.product.create({
    data: {
      name: "Omega 3 Fish Oil 120 caps",
      slug: "omega-3-fish-oil-120-caps",
      description:
        "<p>Premium omega 3 masne kiseline iz ribljeg ulja za zdravlje srca i mozga.</p>",
      shortDesc: "Visokokvalitetne omega 3 masne kiseline.",
      price: 1490,
      sku: "MP-OM3-120",
      stock: 30,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
      ]),
      featured: false,
      active: true,
      categoryId: vitamini.id,
    },
  });

  await prisma.product.create({
    data: {
      name: "Pre-Workout Extreme 300g",
      slug: "pre-workout-extreme-300g",
      description:
        "<p>Moćna pre-workout formula za maksimalnu energiju i fokus.</p>",
      shortDesc: "Intenzivna pre-workout formula.",
      price: 2990,
      salePrice: 2490,
      sku: "BT-PWE-300",
      stock: 3,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=800&q=80",
      ]),
      featured: true,
      active: true,
      categoryId: preWorkout.id,
    },
  });

  console.log("✅ Created sample products");

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
