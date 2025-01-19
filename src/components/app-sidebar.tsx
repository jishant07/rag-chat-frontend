"use client"

import * as React from "react"
import {
  AudioWaveform,
  Blocks,
  Calendar,
  Command,
  Home,
  Inbox,
  MessageCircleQuestion,
  Search,
  Settings2,
  Sparkles,
  Trash2,
  BotMessageSquareIcon

} from "lucide-react"
import { NavFavorites } from "@/components/nav-favorites"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavWorkspaces } from "@/components/nav-workspaces"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import axios from "axios"

// This is sample data.
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: Command,
      plan: "Enterprise",
    }
  ],
  navMain: [
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "Ask AI",
      url: "#",
      icon: Sparkles,
    },
    {
      title: "Home",
      url: "#",
      icon: Home,
      isActive: true,
    },
    {
      title: "Inbox",
      url: "#",
      icon: BotMessageSquareIcon,
      badge: "10",
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const [chatList, setChatList] = React.useState<any>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  React.useEffect(() =>{
    getChats()
  },[])

  const getChats = async () =>{
    setIsLoading(true)
    let result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chat/list_chats`, {headers : {'x-access-token' : localStorage.getItem('token')}})
    let chatData = result.data.chat_list.map((chat: any) => {
      return {
        title: chat.chat_id,
        url: `/chat/${chat.chat_id}`,
        icon: BotMessageSquareIcon
      }
    })
    setChatList(chatData)
    setIsLoading(false)
  }

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <h3>RAG Chat!</h3>
        {!isLoading ? <NavMain items={chatList} /> : <h3>Loading...</h3>}
      </SidebarHeader>
      <SidebarRail />
    </Sidebar>
  )
}
