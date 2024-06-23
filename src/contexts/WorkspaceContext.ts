import Workspace from '@/model/Workspace';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type WorkspaceContextType = {
    workspace: Workspace | null;
    setWorkspace: (workspace: Workspace | null) => void;
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const useWorkspace = (): WorkspaceContextType => {
    const context = useContext(WorkspaceContext);
    if (context === undefined) {
        throw new Error('useWorkspace must be used within a WorkspaceProvider');
    }
    return context;
};

interface WorkspaceProviderProps {
    children: ReactNode;
}

