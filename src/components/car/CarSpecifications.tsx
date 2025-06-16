'use client'

import Image from 'next/image'

interface CarSpecificationsProps {
  year: string | number
  transmission: string
  seats: number
}

export function CarSpecifications({ year, transmission, seats }: CarSpecificationsProps) {
  return (
    <div className="flex overflow-x-auto pb-4 mb-6 gap-4 scrollbar-hide">
      <div className="flex gap-3 items-center shrink-0 rounded-xl border h-12 md:h-14 px-4 md:px-5 bg-zinc-800/80 border-zinc-700/50 hover:border-teal-500/40 transition-colors">
        <div className="p-1.5 rounded-full bg-teal-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path fill="rgb(45, 212, 191)" d="M21 20V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2M9 18H7v-2h2zm0-4H7v-2h2zm4 4h-2v-2h2zm0-4h-2v-2h2zm4 4h-2v-2h2zm0-4h-2v-2h2zm2-5H5V7h14z" />
          </svg>
        </div>
        <p className="font-medium text-sm md:text-base text-white whitespace-nowrap">{year ?? 'N/A'}</p>
      </div>
      <div className="flex gap-3 items-center shrink-0 rounded-xl border h-12 md:h-14 px-4 md:px-5 bg-zinc-800/80 border-zinc-700/50 hover:border-teal-500/40 transition-colors">
        <div className="p-1.5 rounded-full bg-teal-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path fill="rgb(45, 212, 191)" d="M4 21q-1.25 0-2.125-.875T1 18q0-.975.563-1.75T3 15.175v-6.35q-.875-.3-1.437-1.075T1 6q0-1.25.875-2.125T4 3t2.125.875T7 6q0 .975-.562 1.75T5 8.825V11h6V8.825q-.875-.3-1.437-1.075T9 6q0-1.25.875-2.125T12 3t2.125.875T15 6q0 .975-.562 1.75T13 8.825V11h6V8.825q-.875-.3-1.437-1.075T17 6q0-1.25.875-2.125T20 3t2.125.875T23 6q0 .975-.562 1.75T21 8.825V13h-8v2.175q.875.3 1.438 1.075T15 18q0 1.25-.875 2.125T12 21t-2.125-.875T9 18q0-.975.563-1.75T11 15.175V13H5v2.175q.875.3 1.438 1.075T7 18q0 1.25-.875 2.125T4 21" />
          </svg>
        </div>
        <p className="font-medium text-sm md:text-base text-white whitespace-nowrap">{transmission ?? 'N/A'}</p>
      </div>
      <div className="flex gap-3 items-center shrink-0 rounded-xl border h-12 md:h-14 px-4 md:px-5 bg-zinc-800/80 border-zinc-700/50 hover:border-teal-500/40 transition-colors">
        <div className="p-1.5 rounded-full bg-teal-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path fill="rgb(45, 212, 191)" d="M7 18S4 10 4 6s2-4 2-4h1s1 0 1 1s-1 1-1 3s3 4 3 7s-3 5-3 5m5-1c-1 0-4 2.5-4 2.5c-.3.2-.2.5 0 .8c0 0 1 1.8 3 1.8h6c1.1 0 2-.9 2-2v-1c0-1.1-.9-2-2-2h-5Z" />
          </svg>
        </div>
        <p className="font-medium text-sm md:text-base text-white whitespace-nowrap">{seats ?? 'N/A'} seater</p>
      </div>
    </div>
  )
}
