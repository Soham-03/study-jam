import pb from "@/lib/pocketbase";
import { ClientResponseError } from "pocketbase";
import Workspace from "@/model/Workspace";


// list and filter "example" collection records
export async function getListDemo(){
    try{
        const result = await pb.collection('users').getList(1, 50);
        console.log("RESS:", result)
    }catch(error){
        console.log("ERR: ", error)        
    }
}

export async function signUpUser() {
    const data = {
        "username": "test_username",
        "email": "test@example.com",
        "emailVisibility": true,
        "password": "12345678",
        "passwordConfirm": "12345678",
        "name": "test"
    };
    try{
        const authRes = await pb.collection('users').create(data)
        await pb.collection('users').requestVerification('test@example.com');
        console.log("Auth: ",authRes)
    }catch(error){
        const e = error as ClientResponseError
        console.log("Status: ",e.status)
    }
}

export async function logInUser(email: string, password: string) {
    const authRes = await pb.collection('users').authWithPassword(
        email,
        password
    )
    console.log("Auth: ",authRes)
}

export async function getWorkspaces(): Promise<Workspace[]> {
    try {
        const response = await pb.collection('workspaces').getList();
        if (response && response.items) {
            return response.items.map(workspace => ({
                id: workspace.id,
                name: workspace.workspaceName,
                userId: workspace.userId,
                urlToSyllabus: workspace.urlToSyllabus,
                urlToSupportingNotes: workspace.urlToSupportingNotes,
                aiResponseSyllabusBreakdown: workspace.aiResponseSyllabusBreakdown,
                aiResponseChapterWiseNotes: workspace.aiResponseChapterWiseNotes,
                created: workspace.created,
                updated: workspace.updated
            }));
        } else {
            return [];
        }
    } catch (error) {
        console.error('Failed to fetch workspaces:', error);
        throw error;
    }
}

export async function setWorkspace(workspaceName: string){
    const data: Workspace = {
        id: null,
        name: workspaceName,
        userId: "2zk1q4xnsvozgmx",
        urlToSyllabus: "",
        urlToSupportingNotes: "",
        aiResponseSyllabusBreakdown: "",
        aiResponseChapterWiseNotes: "",
        created: "",
        updated: "",
    }
    try {
        const newWorkspace = await pb.collection('workspaces').create(data)
        console.log("Auth: ",newWorkspace)
    } catch (error) {
        console.log(error)
    }
}


export async function setSyllabusUrl(url: string, id: string){
    const data = {
        urlToSyllabus: url
    }
    try {
        const newWorkspace = await pb.collection('workspaces').update(id, data)
        console.log("Auth: ",newWorkspace)
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}




