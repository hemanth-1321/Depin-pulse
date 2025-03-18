import React from 'react'

interface statusProps{
    status: "good" | "bad" 
        
}
export function StatusCircle({ status }: statusProps) {
  
  console.log(status,"status")
  const color =
    status === 'good'
      ? 'bg-green-500'
      : status === 'bad'
      ? 'bg-red-500'
      : 'bg-gray-500';
  return <div className={`w-3 h-3 rounded-full ${color}`} />;
}
