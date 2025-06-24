import bcrypt from "bcryptjs"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function HashPassword(password: string){
  const rounds = 10
  const salt = bcrypt.genSaltSync(rounds)
  const hash = bcrypt.hashSync(password, salt)

  return hash
}