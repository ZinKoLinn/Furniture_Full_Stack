import { prisma } from "./lib/prisma";

async function main() {
  console.log("Start Seeding...");
  await prisma.user.create({
    data: {
      name: "GuYue Fang Yuan",
      email: "GreatLove@gmail.com",
      posts: {
        create: [
          {
            title: "First Gu Refinement",
            content: "Refining Moonlight Gu using SpringAutum Cicada",
            published: true,
          },
          {
            title: "Real First Gu",
            content: "SpringAutum Cicada is the real first gu FangYuan has",
            published: false,
          },
        ],
      },
    },
  });
  console.log("Finished Seeding...");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
