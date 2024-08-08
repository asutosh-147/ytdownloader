import React from 'react'

const Card = ({children}:{children:React.ReactNode}) => {
  return (
    <div className='shadow-xl p-3 w-max bg-slate-800 rounded-md hover:shadow-2xl transition-all duration-300 hover:scale-105 '>
        {children}
    </div>
  )
}

export default Card