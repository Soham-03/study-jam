'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeProvider } from "@/components/themeprovider";
import { Switch } from "@/components/ui/switch"
import { useState } from "react";

export default function UserItem(){
    const [isChecked, setChecked] = useState(false)
    var a = "online"
    if(isChecked){
        a = "online"
    }
    else{
        a = "offline"
    }
    return <div className="flex flex-row items-center justify-start gap-2 border rounded-[8px] p-4 w-[300px]">
        <div>
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>SP</AvatarFallback>
            </Avatar>
        </div>
        <div className="grow flex flex-col">
            <p className="text-[16px] font-bold">Soham Parab</p>
            <p className=" text-[12px] text-neutral-500">@soham123</p>
        </div>
        <div className="flex flex-col items-center">
            <Switch
                checked= {isChecked}
                onCheckedChange= {setChecked}
            />
            <p className=" text-[10px] pt-2">{a}</p>
        </div>
    </div>
}