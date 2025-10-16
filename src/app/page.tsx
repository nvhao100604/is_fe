'use client'
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import LoginPage from "./auth/login/page"

function Home() {
  // const router = useRouter()

  // useEffect(() => {
  //   router.push('/dashboard')
  // }, [])
  return (
    <LoginPage />
  )
}

export default Home

