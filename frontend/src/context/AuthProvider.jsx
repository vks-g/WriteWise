'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import AuthContext from './AuthContext'
import axios from '@/lib/axios'

const getErrorMessage = (error) => {
  if (error?.response?.data?.message) {
    return error.response.data.message
  }

  if (error?.message) {
    return error.message
  }

  return 'Something went wrong. Please try again.'
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8888"
  console.log(apiUrl);

  const getCurrentUser = useCallback(async () => {

    try {
      const response = await axios.get(`${apiUrl}/auth/me`, {
        withCredentials: true,
      })

      const currentUser = response.data?.user ?? null
      setUser(currentUser)

      return {
        success: true,
        user: currentUser,
        data: response.data,
      }
    } catch (error) {
      setUser(null)

      return {
        success: false,
        error: getErrorMessage(error),
        data: error?.response?.data,
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    getCurrentUser()
  }, [getCurrentUser])

  const signup = useCallback(async (payload) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/signup`, payload, {
        withCredentials: true,
      })

// here as taught in class the token is sent in response headers as a cookie , so the browser automatically stores it and includes it in future requests

      const newUser = response.data?.user ?? null
      setUser(newUser)

      return {
        success: true,
        user: newUser,
        data: response.data,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error),
        data: error?.response?.data,
      }
    }
  }, [])

  const login = useCallback(async (payload) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, payload, {
        withCredentials: true,
      })

// here as taught in class the token is sent in response headers as a cookie , so the browser automatically stores it and includes it in future requests

      const authenticatedUser = response.data?.user ?? null
      setUser(authenticatedUser)

      return {
        success: true,
        user: authenticatedUser,
        data: response.data,
      }
    } catch (error) {
      setUser(null)

      return {
        success: false,
        error: getErrorMessage(error),
        data: error?.response?.data,
      }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await axios.post(`${apiUrl}/auth/logout`, {}, {
        withCredentials: true,
      })
    }
    catch (error) {
      return {
        success: false,
        error: getErrorMessage(error),
        data: error?.response?.data,
      }
    } 
    finally {
      setUser(null)
    }

    return {
      success: true,
    }
  }, [])

  const googleLogin = useCallback(() => {

    window.location.href = `${apiUrl}/auth/google`;

  }, [])

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    signup,
    login,
    logout,
    getCurrentUser,
    setUser,
    googleLogin,
  }), [getCurrentUser, loading, login, logout, signup, user, googleLogin])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider