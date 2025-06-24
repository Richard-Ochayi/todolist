"use server"

import { auth, signIn, signOut } from "@/app/auth"
import prisma from "@/lib/db"
import { error } from "console";
import { AuthError } from "next-auth"


export async function createTask(task: string){
    const session = await auth();
    const email = session?.user?.email

    const user = await prisma.user.findUnique({
        where: {email: email as string}
    })

    try {
        if(task === ""){
            return {error: true, message: "Cannot submit empty task"}
        }
        await prisma.task.create({
            data: {
                title: task,
                userId: user?.id as string,
            }
        })
        console.log("success")
        return {error: false, message: "Task created successfully"}
    } catch (error) {
        console.log(error)
        return {error: true, message: "An error occured"}
    }
}

export async function deleteTask(taskId: number){
   try {
    const deletedTask = await prisma.task.delete({
        where: { id: taskId },
    });
    return deletedTask;
   } catch (error) {
    console.error("Error deleting task:", error);
    throw error
   }
}

export async function activeTasks(id: number, active: boolean)  {
    await prisma.task.update({
        where: {id},
        data: { active },
    });
}

export async function logout() {
  await signOut()
}

export async function Login(email:string, password: string){
    try {
        if(email === "" || password === ""){
            return {error: true, message: "please enter an email"}
        }
        const existinguser = prisma.user.findUnique({where: {email: email}})
        if(!existinguser){
            return {error: true, message: "Invalid email or password"}
        }

        const url = await signIn("credentials", {email:email, password:password, redirect: false})

        return {error: false, message: "Sign in successful"}

    } catch (error) {
        if (error instanceof AuthError){
            switch(error.type){
                case "CredentialsSignin":
                    return {error: true, message: "Invalid email or password"}
                default:
                    return {error: true, message: "Something went wrong"}
            }
        }
        return {error: true, message: "Something went wrong"}
    }
}

export async function updateTask(id: number, newTitle: string) {
    const updated = await prisma.task.update({
        where: { id },
        data: {  title: newTitle },
    });

    return updated;

}