"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import axios, {isCancel, AxiosError} from 'axios';
import Link from "next/link"
import { useRouter } from 'next/navigation'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const router = useRouter()
  const initFormState = {email : "", password: ""}
  const [loginForm, setLoginForm] = useState<{[key: string]: string}>(initFormState);
  const { toast } = useToast()

  const handleInput = (e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name : string) => {
    setLoginForm({...loginForm, [e.target.name] : e.target.value})
  }

  const checkForm = () =>{
    let flag = true
    Object.keys(loginForm).forEach(key =>{
      if(loginForm[key] == ""){
        flag = false
      }
    })
    return flag
  }

  const handleSubmit = async (e : any) =>{
    e.preventDefault()

    if(checkForm()){
      try{
        let result = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`,loginForm)
        console.log(result)
        localStorage.setItem("token" , result.data.access_token)
        router.replace("/chat")
      }catch(e : any){
        toast({
          title : "Something went wrong",
          description : e?.response?.data?.message,
          variant : "destructive"
        })
      }
    }
    else{
      toast({
        title: "Form Not Filled Correctly",
        description: "Please fill all the required fields",
        variant : "destructive"
      })
    }
    
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your Acme Inc account
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  name="email"
                  required
                  onChange={(e) => handleInput(e, "name")}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input 
                  id="password" type="password" 
                  required onChange={(e) => handleInput(e, "password")}
                  name="password"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full"
                onClick={(e) => handleSubmit(e)}
              >
                Login
              </Button>

              <Link href={"/signup"}><Button 
                type="submit" 
                className="w-full"
              >
                Sign Up
              </Button></Link>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="https://plus.unsplash.com/premium_photo-1668447598676-30bbd44792c7?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
