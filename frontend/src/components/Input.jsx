import React from 'react'

function Input({label,placeholder,type,onChange}) {
  return (
    <div className='d-flex content-center'>
        <div className='text-sm font-medium text-left py-2'>{label}</div>
        <input onChange={onChange} type={type} placeholder={placeholder} className="w-full px-2 py-1 border rounded border-slate-200" />
    </div>
  )
}

export default Input