"use client";

import { useState , useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from "next/navigation";
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/context/AuthContext'
import CardSwap, { Card } from '@/components/animated/CardSwap'

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { signup, getCurrentUser , googleLogin } = useAuth()
  const searchParams = useSearchParams();
  const OAuthError = searchParams.get("error");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fix the errors below')
      return
    }

    setIsLoading(true)

    try {
      const result = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      })
      if (!result?.success) {
        console.log(result);
        toast.error(result?.data?.error || 'Signup failed. Please try again.')
        return
      }
      if (!result.user) {
        data = await getCurrentUser()
      }
      toast.success('Account created successfully!')
      router.push('/dashboard')
    } 
    catch (error) {
      console.log(error);
      const message = error?.message || 'Signup failed. Please try again.'
      toast.error(message)
    } 
    finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    googleLogin();
  }
  
  useEffect(() => {
    if (OAuthError) {
      toast.error('Google authentication failed. Please try again.')
    }
  }, [OAuthError]);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-black via-black to-purple-900/50 dark:from-black dark:via-black dark:to-pink-900/50 overflow-hidden">
      
      <div className={`fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-gradient-to-b to-purple-600/20 pointer-events-none ${isLoading ? 'backdrop-blur-2xl' : ''}`} />

      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

          <div className="absolute inset-0 bg-black/40 backdrop-blur-2xl" />
          

          <div className="relative z-10 bg-gradient-to-br from-purple-950/80 via-black/90 to-pink-950/80 dark:from-purple-950/80 dark:via-black/90 dark:to-pink-950/80 border border-white/10 rounded-2xl shadow-2xl shadow-purple-500/50 p-8 sm:p-10 max-w-sm w-full">
            <div className="flex flex-col items-center justify-center space-y-6">
          
              <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 border-r-purple-400 animate-spin" />
                <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-pink-400 border-l-purple-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }} />
              </div>
              
            
              <div className="text-center space-y-2">
                <p className="text-lg sm:text-xl font-semibold text-white">Creating Account...</p>
                <p className="text-sm text-white/60">Render is slow broo 😭 Wait ...</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className={`relative z-10 flex items-center justify-center min-h-screen px-4 py-8 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
      
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
      
          <div className="w-full flex justify-center lg:justify-end lg:pr-48">
            <div className="w-full max-w-sm relative overflow-hidden rounded-2xl shadow-2xl shadow-purple-500/50 before:absolute before:inset-0 before:rounded-2xl before:p-[2px] before:bg-gradient-to-r before:from-purple-500 before:via-pink-500 before:to-purple-500 before:-z-10">
              
  
              <div className="relative z-10 rounded-2xl bg-black/90 dark:bg-black border border-white/10">
              
       
                <div className="px-5 sm:px-6 pt-6 pb-6 space-y-1">
                  <h1 className="text-2xl font-bold text-white">Create Account</h1>
                  <p className="text-xs text-white/60">Start your blogging journey with WriteWise</p>
                </div>

       
                <div className="px-5 sm:px-6 py-5 max-h-[calc(100vh-200px)] overflow-y-auto">
                  <form onSubmit={handleSubmit} className="space-y-3">
                    
   
                    <div className="space-y-4">
                      <label htmlFor="name" className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">Full Name</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        aria-invalid={!!errors.name}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent backdrop-blur-sm transition-all text-sm"
                      />
                      {errors.name && (
                        <p className="text-xs text-red-400 font-medium">{errors.name}</p>
                      )}
                    </div>

                 
                    <div className="space-y-4">
                      <label htmlFor="email" className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">Email Address</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="m@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        aria-invalid={!!errors.email}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent backdrop-blur-sm transition-all text-sm"
                      />
                      {errors.email && (
                        <p className="text-xs text-red-400 font-medium">{errors.email}</p>
                      )}
                    </div>

         
                    <div className="space-y-4">
                      <label htmlFor="password" className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">Password</label>
                      <div className="relative">
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleChange}
                          aria-invalid={!!errors.password}
                          className="w-full px-3 py-2 rounded-lg bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent backdrop-blur-sm pr-10 transition-all text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors cursor-pointer"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-xs text-red-400 font-medium">{errors.password}</p>
                      )}
                    </div>

              
                    <div className="space-y-4">
                      <label htmlFor="confirmPassword" className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">Confirm Password</label>
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          aria-invalid={!!errors.confirmPassword}
                          className="w-full px-3 py-2 rounded-lg bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent backdrop-blur-sm pr-10 transition-all text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors cursor-pointer"
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-xs text-red-400 font-medium">{errors.confirmPassword}</p>
                      )}
                    </div>

 
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-5 px-4 py-2.5 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-200"
                    >
                      {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                  </form>

           
                  <div className="relative my-4">
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2 bg-white/5 text-white/60">or </span>
                    </div>
                  </div>

 
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full px-4 py-2.5 rounded-lg font-medium text-sm text-white bg-white/10 hover:bg-white/15 border border-white/20 dark:border-white/10 backdrop-blur-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                  </button>
                </div>

       
                <div className="px-5 sm:px-6 py-4 border-t border-white/10 text-center">
                  <p className="text-xs text-white/70">
                    Already have an account?{' '}
                    <Link
                      href="/login"
                      className="font-semibold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                    >
                      Login
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>


          <div className="hidden lg:flex justify-center lg:justify-start items-center h-[600px]">
            <CardSwap width={750} height={750} cardDistance={50} verticalDistance={60} delay={4000}>
              <Card customClass="w-96 h-80 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-white/30 backdrop-blur-md flex items-center justify-center">
                <div className="text-white text-center px-6">
                  <div className="text-4xl mb-3">✨</div>
                  <h3 className="text-xl font-bold mb-2">AI-Powered</h3>
                  <p className="text-sm text-white/80">Your creative companion</p>
                </div>
              </Card>
              <Card customClass="w-96 h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-white/30 backdrop-blur-md flex items-center justify-center">
                <div className="text-white text-center px-6">
                  <div className="text-4xl mb-3">📝</div>
                  <h3 className="text-xl font-bold mb-2">Write Freely</h3>
                  <p className="text-sm text-white/80">Express your thoughts</p>
                </div>
              </Card>
              <Card customClass="w-96 h-80 bg-gradient-to-br from-orange-500/20 to-red-500/20 border-white/30 backdrop-blur-md flex items-center justify-center">
                <div className="text-white text-center px-6">
                  <div className="text-4xl mb-3">🚀</div>
                  <h3 className="text-xl font-bold mb-2">Publish Fast</h3>
                  <p className="text-sm text-white/80">Share with the world</p>
                </div>
              </Card>
              <Card customClass="w-96 h-80 bg-gradient-to-br from-orange-500/20 to-red-500/20 border-white/30 backdrop-blur-md flex items-center justify-center">
                <div className="text-white text-center px-6">
                  <div className="text-4xl mb-3">🚀</div>
                  <h3 className="text-xl font-bold mb-2">Publish Fast</h3>
                  <p className="text-sm text-white/80">Share with the world</p>
                </div>
              </Card>
            </CardSwap>
          </div>
        </div>
      </div>
    </div>
  )
}