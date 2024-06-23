'use client'

import { icons, Key, Library, Music3, Presentation, ReceiptIndianRupee, User, Users } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./ui/command"
import UserItem from "./userprofile"
import { useState } from "react"
import Link from "next/link"

const menulist = [
    {
        group:"Main Deal",
        items: [
            {
                link: "/studyjam",
                icon: <Library/>,
                text: "My Space"
            },
            {
                link: "/jamspace",
                icon: <Music3/>,
                text: "Jam Space"
            },
            {
                link: "/",
                icon: <Users/>,
                text: "Fam Space"
            },
            {
                link: "/",
                icon: <Presentation/>,
                text: "White Space"
            }
        ]
    },
    {
        group:"No Shit",
        items: [
            {
                link: "/",
                icon: <User/>,
                text: "Profile"
            },
            {
                link: "/",
                icon: <Key/>,
                text: "API Key"
            },
            {
                link: "/",
                icon: <ReceiptIndianRupee/>,
                text: "Billing"
            },
            {
                link: "/",
                icon: <Key/>,
                text: "Logs"
            }
        ]
    }
]

export default function Sidebarm() {
    const [value, setValue] = useState("My Space")
    return <div className=" fixed flex flex-col gap-4 w-[300px] min-w-[300px] border-r min-h-screen p-4">
        <div className="flex flex-row">
            <UserItem />
        </div>
        <div className="grow border rounded-[5px]" >
            <Command style={{overflow: 'visible'}}>
                {/* <CommandInput placeholder="Type a command or search..." /> */}
                <CommandList style={{overflow: 'visible'}}>
                { menulist.map((menu: any, key:number) => (
                    <CommandGroup key={key} heading={menu.group}>
                        {
                            menu.items.map((option: any, optionKey: number) => 
                            <Link href={option.link}>
                                <CommandItem key={optionKey} className={`flex gap-4 cursor-pointer`} onSelect={(currentValue)=>{
                                    setValue(currentValue === value? "": currentValue)
                                    console.log("Value:",currentValue)
                                    }}>
                                    <div className="p-1.5">{option.icon}</div>
                                    {option.text}   
                                </CommandItem>
                                
                            </Link>
                            )
                        }
                        <CommandSeparator/>
                    </CommandGroup> ))}
                    <p className="p-2 text-slate-500">GGWPPPP</p>
                </CommandList>
            </Command>
        </div>
        <div>Settings / Notifications</div>

    </div>
}