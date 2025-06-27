import Image from "next/image";
import React from 'react'
import prisma from "@/lib/db";
import TaskListInput from "@/components/TaskListInput";
import { title } from "process";
import Hones from "@/components/Hones";
import { Button } from "@/components/ui/button";
import { Check, CheckCheckIcon, CheckIcon, CircleCheckBigIcon, DeleteIcon, LucideDelete } from "lucide-react";
import TaskCard from "@/components/TaskCard";
import { SignOut } from "@/components/SignOut";
import { auth } from "./auth";
import { redirect } from "next/navigation";
import Header from "@/components/Header";


export default async function Home() {
  const session = await auth();
  if (!session) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email as string }
  })

  const tasks = await prisma.task.findMany({
    where: { userId: user?.id },
    orderBy: { createdAt: "desc" }
  })


  return (
    <div className="h-screen flex flex-col items-center bg-[#1A1A1A] relative">
      <div className="flex justify-center w-full bg-black p-15">
        <Image className="" alt="logo" src="/Logo.png" width={100} height={100} />
      </div >
      <Header session={session} />
      <TaskListInput />
      <Hones tasks={tasks} />
      {tasks.length >= 1 ? (
        <div className="text-white p-2 md:p-0 w-full max-w-xl flex flex-col">
          {tasks.filter((task) => task.active === true).map((task, index) => (
            <TaskCard key={task.id} task={task} />
          ))}
          {tasks.filter((task) => task.active === false).map((task, index) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>

      ) : (
        <div className="h-screen flex flex-col items-center w-full p-19">
          <Image className="p-3" alt="logo" src="/Clipboard.png" width={100} height={100} />
          <div className="text-white">
            <p>You dont have any tasks registered yet.</p>
            <p>Create tasks and organize your to-do items.</p>
          </div>
        </div>
      )}

    </div>
  );
}
