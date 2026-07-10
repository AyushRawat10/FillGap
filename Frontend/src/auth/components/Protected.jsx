import React from 'react'
import { useAuth } from '../hooks/useAuth.hook.js'
import Loader from './Loader.jsx'
import {Navigate} from "react-router"

const Protected = ({children}) => {
    const {loading, user} = useAuth()

    if(loading) {
        return <Loader />
    }

    if(!user) {
        return <Navigate to="/api/v1/auth/login" replace />
    }

  return children
}

export default Protected