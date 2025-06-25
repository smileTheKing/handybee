import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// export async function saltAndHashPassword(password: string): Promise<string> {

  
//   // const saltRound = 10;

//   // const hashedPassword =  bcrypt.hashSync(password, saltRound);
  
//   return password;// This is a placeholder for actual hashing logic.
  
  
// }
// interface User {
//   email: string;
//   passwordHash: string;
//   name: string;
// }

// export function getUserFromDb(email: string, passwordHash: string): string {
//   // This is a placeholder for your actual database logic.
//   // In a real application, you would query your database to find the user.
//   // For demonstration purposes, let's assume we have a hardcoded user.
//   const users: User[] = [
//     { email:"ff" ,passwordHash: "hashed-password1", name: "User One" },
//     { email:"ff2" ,passwordHash: "hashed-password2", name: "User Two" },    
//   ]

//   const user = users.find(
//     (user) => user.email === email && user.passwordHash === passwordHash
//   )
//   if (!user) {
//     throw new Error("User not found or invalid credentials.")
//   }
//   return JSON.stringify(user) // Return user data as a string for simplicity
// }
