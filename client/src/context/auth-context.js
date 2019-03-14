import React from 'react'

const authContext = React.createContext({ refetch: null, session: null })

export default authContext