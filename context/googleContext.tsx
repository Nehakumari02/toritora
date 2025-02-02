import { GoogleOAuthProvider } from '@react-oauth/google'
import React from 'react'

function GoogleProvider({children}:any) {
  return (
    <GoogleOAuthProvider
        clientId='363447148265-4j9m9kimi9j554v3j02pulhlk0bb987s.apps.googleusercontent.com'
    >
        {children}
    </GoogleOAuthProvider>
  )
}

export default GoogleProvider