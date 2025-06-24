"use client";
import { useState } from 'react';
import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PlusCircleIcon } from 'lucide-react'
import { PrismaClient, Task } from '@/lib/generated/prisma';
import { createTask } from '@/actions/taskactions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import LoadingIndicator from './LoadingIndicator';



const TaskListInput = () => {
  const [task, setTask] = useState("")
  const router = useRouter();
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    const response = await createTask(task)
    setLoading(false)

    if (response.error) {
      toast.success(response.message)
    } else {
      toast.success(response.message)
    }
    setTask("")
    router.refresh();
  }
  return (
    <div className='flex flex-row gap-2 absolute top-35'>
      <Input className='w-full sm:w-120 border-none p-6 bg-[#262626] text-white outline-black' placeholder='Add A New Task' type='text'
        onChange={(e) => setTask(e.target.value)}
        value={task}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit();
          }
        }}
      />
      <Button onClick={handleSubmit} disabled={loading || !task.trim()} className=' bg-[#1E6F9F] w-20 p-6 hover cursor-pointer ' >
          <div className='flex items-center gap-1'>
            <span>Add</span>
            <PlusCircleIcon />
          </div>
      </Button>
      <LoadingIndicator isLoading={loading}/>
    </div>
  )
}

export default TaskListInput