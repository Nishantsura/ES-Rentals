"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
  color?: string
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      className={cn(
        "fixed bottom-0 sm:static z-50 mb-6 sm:mb-0 sm:py-3 mx-auto w-full flex justify-center items-center",
        className,
      )}
    >
      <div className="flex items-center justify-center gap-2 bg-background/10 border border-border/50 backdrop-blur-lg py-1 px-2 rounded-full shadow-lg max-w-fit mx-auto hover:border-primary/20 transition-all duration-300">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-4 py-1.5 rounded-full transition-all duration-300",
                "text-white hover:text-white hover:bg-primary/5",
                isActive && "bg-white text-black",
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className={cn("md:hidden", item.color)}>
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-primary/20 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-gray-300 dark:bg-gray-500 rounded-t-full">
                    <div className="absolute w-12 h-6 bg-gray-300/30 dark:bg-gray-400/30 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-gray-300/30 dark:bg-gray-400/30 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-gray-300/30 dark:bg-gray-400/30 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
