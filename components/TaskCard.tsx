"use client"
import { BsPencil, BsTrash } from "react-icons/bs";
import { Task } from '@/lib/generated/prisma'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { activeTasks, deleteTask, updateTask } from '@/actions/taskactions'
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner";
import { RiEdit2Fill } from "react-icons/ri"
import LoadingIndicator from "./LoadingIndicator";

const TaskCard = ({ task }: { task: Task }) => {
    const router = useRouter();
    const [isEditing, setisEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);
    const [loading, setloading] = useState(false)

    const handleCheckbox = async () => {
        setloading(true)
        const newState = !task.active;
        await activeTasks(task.id, newState);
        setloading(false)
        router.refresh();
    };

    const handleDelete = async () => {
        setloading(true)
        await deleteTask(task.id);
        toast.error("Deleted Task Successfully")
        setloading(false)
        router.refresh();
    }

    const handleEdit = () => {
        setisEditing(true);
    }

    const handleUpdate = async () => {
        setloading(true)
        if (editedTitle.trim() === "")
            toast.error("Task cannot be empty")
        await updateTask(task.id, editedTitle);
        toast.success("Task updated");
        setisEditing(false);
        setloading(false)
        router.refresh();
    }


    return (

        <div className="flex justify-between items-center w-full gap-30 p-3 bg-[#262626] mb-3 rounded-md ">
            <div className="flex items-center gap-3">
                <div className="">
                    <Checkbox checked={!task.active} onClick={handleCheckbox} className={'border border-[#4EA8DE] rounded-md cursor-pointer  data-[state=checked]:bg-[#5E60CE] data-[state=checked]:border-[#5E60CE] '} />
                </div>
                {isEditing ? (
                    <Input
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        onBlur={handleUpdate}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleUpdate();
                        }}
                        className="bg-[#333333] text-white w-full"
                        autoFocus
                    />
                ) : (
                    <span className={!task.active ? "line-through opacity-60" : ""} onDoubleClick={handleEdit}>
                        {task.title}
                    </span>
                )}
            </div>
            <div className="flex">
                {!isEditing && (
                    <Button className="bg-[#262626] text-[#808080]" onClick={handleEdit}>
                        <RiEdit2Fill />
                    </Button>
                )}
                <Button className="bg-[#262626] text-[#808080]" onClick={handleDelete} >
                    <BsTrash />
                </Button>
            </div>
                <LoadingIndicator isLoading={loading} />
        </div>
    )
}

export default TaskCard