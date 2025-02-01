"use client"
import { useRouter } from 'next/navigation';
import React from 'react'

function MyPage() {
  const router = useRouter();

  const logout = async() => {
    const res = await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if(res.status === 204){
      router.replace('/onboard')
    }
  }

  return (
    <div>
      MyPage
      <div>
        <button onClick={() => logout()}>Logout</button>
      </div>
    </div>
  )
}

export default MyPage
