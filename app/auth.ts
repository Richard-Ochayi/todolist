import prisma from "@/lib/db";
import { error } from "console";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs"



export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google,

        Credentials({
          name: "Credentials",
            credentials: {
              email: { label: "email", type: "email" },
              password: { label: "password", type: "password" },
            },
            authorize: async (credentials) => {

              if (!credentials.email || !credentials.password){
                return null;
              }
              let user = await prisma.user.findUnique({
                where: {email: credentials.email as string}
              })

              if(!user){

                const passwordHash = await bcrypt.hash(credentials.password as string, 10);

                user = await prisma.user.create({
                  data: {
                    email: credentials.email as string,
                    passwordHash: passwordHash,
                  }
                })
              } else {
                if (!user.passwordHash) {
                  return null;
                }

                const isMatch = await bcrypt.compare(credentials.password as string, user.passwordHash);

                if (!isMatch){
                  console.log("password mismatch")
                  return null
                }
              }
              return user;

            }
          })

    ],
})