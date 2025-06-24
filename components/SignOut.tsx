"use client"
import React from 'react'
import { Button } from './ui/button'
import { logout } from '@/actions/taskactions'

export function SignOut() {
  return (
    <Button className='cursor-pointer' onClick={async () => {await logout()}}>
      Sign Out
    </Button>
  )
}
