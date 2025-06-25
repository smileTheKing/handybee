import { prisma } from "@/prisma/prisma";



//get user from db
export async function getUserFromDb(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error fetching user from database:", error);
    throw error;
  }
}
// Function to create a new user in the database
export async function createUserInDb(email: string, name: string, passwordHash: string) {
  try {
    const newUser = await prisma.user.create({
      data: {
        email: email,
        name: name,
        passwordHash: passwordHash,
      },
    });

    return newUser;
  } catch (error) {
    console.error("Error creating user in database:", error);
    throw error;
  }
}