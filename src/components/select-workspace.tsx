import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import Workspace from "@/model/Workspace";

interface SelectWorkspaceProps {
    workspaces: Workspace[];
    setWorkspaces: (workspaces: Workspace[]) => void;
    selectedWorkspace: Workspace | null;
    setSelectedWorkspace: (workspace: Workspace | null) => void;
}

export default function SelectWorkspace({ 
    workspaces,
    setWorkspaces,
    selectedWorkspace,
    setSelectedWorkspace,
}: SelectWorkspaceProps) {
    const [open, setOpen] = useState(false);

    const handleSelectWorkspace = (workspaceName: string) => {
        // Find the workspace based on the name
        const workspace = workspaces.find(ws => ws.name === workspaceName);
        setSelectedWorkspace(workspace!!);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild className="pt-1">
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {selectedWorkspace?.name || "Select Workspace"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search Workspace" />
                    <CommandList>
                        {workspaces.length === 0 ? (
                            <CommandEmpty>No workspace found.</CommandEmpty>
                        ) : (
                            <CommandGroup>
                                {workspaces.map((workspace) => (
                                    <CommandItem
                                        key={workspace.id}
                                        value={workspace.name}
                                        onSelect={() => handleSelectWorkspace(workspace.name)}
                                    >
                                        <Check
                                            className={
                                                selectedWorkspace?.name === workspace.name ? 
                                                "mr-2 h-4 w-4 opacity-100" : 
                                                "mr-2 h-4 w-4 opacity-0"
                                            }
                                        />
                                        {workspace.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
