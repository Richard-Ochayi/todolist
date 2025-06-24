import { Task } from '@/lib/generated/prisma'
import React from 'react'

const Hones = ({ tasks }: { tasks: Task[] }) => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => !task.active).length;

    return (
        <div className='flex justify-center gap-20 sm:gap-80 p-8 mt-10 w-full'>
            <div className='flex items-center whitespace-nowrap'>
                <h1 className='text-[#4EA8DE] font-semibold'>Created tasks</h1>
                <span className='bg-[#333333] text-white text-xs px-2 py-1 rounded-full ml-2'>{totalTasks}</span>
            </div>
            <div className='flex items-center whitespace-nowrap'>
                <h1 className='text-[#8284FA] font-semibold '>Completed</h1>
                <span className='bg-[#333333] text-white text-xs px-2 py-1 rounded-full ml-2'>{completedTasks} of {totalTasks}</span>
            </div>
        </div>
    )
}

export default Hones