import { createDB } from "../lib/db";
import { faker } from "@faker-js/faker";

const CONDITIONS = ["new", "used", "like_new", "unused"] as const;

async function seed() {
  const db = createDB();

  // Create some users
  const users = await Promise.all(
    Array.from({ length: 5 }).map(async () => {
      return db
        .insertInto("users")
        .values({
          username: faker.internet.userName(),
          displayName: faker.person.fullName(),
          email: faker.internet.email(),
          password: null,
        })
        .returningAll()
        .executeTakeFirstOrThrow();
    })
  );

  // Create some marketplace items
  await Promise.all(
    users.flatMap((user) =>
      Array.from({ length: 3 }).map(async () => {
        const marketplace = await db
          .insertInto("marketplace")
          .values({
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: Math.round(parseFloat(faker.commerce.price())),
            category: "car",
            condition: faker.helpers.arrayElement(CONDITIONS),
            userId: user.id,
            createdAt: new Date().getTime(),
          })
          .returningAll()
          .executeTakeFirstOrThrow();

        // Add some photos
        await db
          .insertInto("marketplacePhotos")
          .values(
            Array.from({ length: faker.number.int({ min: 1, max: 3 }) }).map(
              () => ({
                marketplaceId: marketplace.id,
                photoUrl: faker.image.url(),
                createdAt: new Date().getTime(),
              })
            )
          )
          .execute();
      })
    )
  );
}

seed();
