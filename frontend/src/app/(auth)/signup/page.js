import React from 'react'
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const Signup = () => {
  return (
    <>
        <Card className="w-full max-w-sm">
        <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>
            Enter your email below to login to your account
            </CardDescription>
            <CardAction>
            </CardAction>
        </CardHeader>
        <CardContent>
            <form>
            <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                />
                </div>
                <div className="grid gap-2">
                <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" required />
                </div>
            </div>
            </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full">
            Register
            </Button>
        </CardFooter>
        </Card>
    </>
  )
}

export default Signup