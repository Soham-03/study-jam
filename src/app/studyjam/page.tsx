'use client';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { FileUploader } from "@/components/ui/dropzone";
import { SetStateAction, useEffect, useState } from "react";
import SelectWorkspace from "@/components/select-workspace";
import { FileState, MultiFileDropzone } from "@/components/multi-file-select";
import { useEdgeStore } from "@/lib/edgestore";
import { string } from "zod";
import { getListDemo, getWorkspaces, setSyllabusUrl, setWorkspace } from "../api/pocketbase/route";
import { SeparatorVertical } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import TypographyDemo from "@/components/typo-demo";
import TextareaForm from "@/components/chat-input-text";
import { Textarea } from "@/components/ui/textarea";
import Workspace from "../../model/Workspace";
import Link from "next/link";
import { Toast } from "@radix-ui/react-toast";
import TypingEffect from "@/components/typewriter-text";
import { sendPdfProcessingRequestWithFetch } from "../api/genmodel/route";

export default function StudyJam() {
    interface result {
        url: string;
        size: number;
        uploadedAt: Date;
        metadata: Record<string, never>;
        path: Record<string, never>;
        pathOrder: string[];
    }
    const [files, setFiles] = useState<File[] | null>(null);
    const [result, setResult] = useState<result | null>(null)

    const handleFileChange = (newFiles: File[] | null) => {
        setFiles(newFiles);
    };

    const [fileStates, setFileStates] = useState<FileState[]>([]);
    const { edgestore } = useEdgeStore();
    function updateFileProgress(key: string, progress: FileState['progress']) {
        setFileStates((fileStates) => {
            const newFileStates = structuredClone(fileStates);
            const fileState = newFileStates.find(
                (fileState) => fileState.key === key,
            );
            if (fileState) {
                fileState.progress = progress;
            }
            return newFileStates;
        });
    }

    function printUrl() {
        console.log("GGGG: ", result?.url)
    }

    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
    const [syllabusDowloadUrl, setSyllabusDownloadUrl] = useState<string | null>();
    const [data, setData] = useState();
    const [responseDetails, setResponseDetails] = useState({});

    useEffect(() => {
        getWorkspaces()
            .then(data => {
                // Sort the workspaces by creation date in descending order
                const sortedWorkspaces = data.sort((a, b) => b.created.localeCompare(a.created));
                setWorkspaces(sortedWorkspaces);
                // setWorkspace(sortedWorkspaces);
                // Set the most recently created workspace as the default selected value
                if (sortedWorkspaces.length > 0) {
                    setSelectedWorkspace(sortedWorkspaces[0])
                    console.log(sortedWorkspaces)
                    // setValue(sortedWorkspaces[0].name);
                }
                // if (sortedWorkspaces.length > 0) {
                //     // setWorkspace(sortedWorkspaces);
                // }
            })
            .catch(error => {
                console.error("Failed to fetch workspaces:", error);
                setWorkspaces([]);
            });
    }, [setWorkspaces, setSelectedWorkspace, setSyllabusDownloadUrl]);

    const handleTextareaSubmit = async () => {
        console.log("Text submitted:", text);
        try {
            console.log("URL: ",selectedWorkspace?.urlToSupportingNotes)
            if(selectedWorkspace?.urlToSyllabus){
                const result = await sendPdfProcessingRequestWithFetch(
                    text,
                    selectedWorkspace.urlToSyllabus
                );
                setData(result.data);
            setResponseDetails({
                status: result.status,
                statusText: result.statusText,
                headers: [result.headers.entries()],
            });
            }
            

            
        } catch (error) {
            console.log(error);
        }
    };

    const [text, setText] = useState('');

    const handleTextareaChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setText(event.target.value);
    };

    const handleTextareaKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleTextareaSubmit();
        }
    };


    return (
        <div className="flex flex-col w-full gap-2">
            <h2 className="mt-10 border-b scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0 pb-2">
                Your Study Space
            </h2>
            <div>
                <SelectWorkspace workspaces={workspaces} setWorkspaces={setWorkspaces} selectedWorkspace={selectedWorkspace} setSelectedWorkspace={setSelectedWorkspace} />
            </div>
            <div className="flex flex-row mt-4">
                {
                    <div className="flex-grow w-full basis-2/3 overflow-y-auto h-max">
                        <TypingEffect />
                        <div>
                            <Textarea
                                placeholder="Write and press enter"
                                onKeyDown={handleTextareaKeyDown}
                                onChange={handleTextareaChange}
                                value={text}
                            />
                        </div>
                        <p className="leading-7 [&:not(:first-child)]:mt-6">
                            {JSON.stringify(data)}
                        </p>

                    </div>
                }
                <div>
                    <Separator orientation="vertical" className="h-full" />
                </div>
                <div className="stickyflex-grow basis-1/3 ">
                    <div className="flex flex-col h-[200px] ps-2">
                        <MultiFileDropzone
                            value={fileStates}
                            onChange={(files) => {
                                setFileStates(files);
                            }}
                            onFilesAdded={async (addedFiles) => {
                                setFileStates([...fileStates, ...addedFiles]);
                                await Promise.all(
                                    addedFiles.map(async (addedFileState) => {
                                        try {
                                            const res = await edgestore.publicFiles.upload({
                                                file: addedFileState.file,
                                                onProgressChange: async (progress) => {
                                                    updateFileProgress(addedFileState.key, progress);
                                                    if (progress === 100) {
                                                        // wait 1 second to set it to complete
                                                        // so that the user can see the progress bar at 100%
                                                        await new Promise((resolve) => setTimeout(resolve, 1000));
                                                        updateFileProgress(addedFileState.key, 'COMPLETE');
                                                    }
                                                },
                                            });
                                            console.log(res);
                                            setResult(res)
                                            // if(result?.url && selectedWorkspace?.id){
                                            if (selectedWorkspace?.id) {
                                                console.log("GGSSS")
                                                const a = setSyllabusUrl(res.url, selectedWorkspace?.id)
                                                if (await a) {
                                                    setSyllabusDownloadUrl(res.url)
                                                }
                                                else {

                                                }
                                            }



                                            // }
                                        } catch (err) {
                                            updateFileProgress(addedFileState.key, 'ERROR');
                                        }
                                    }),
                                );
                            }
                            }
                        />
                        {selectedWorkspace?.urlToSyllabus && selectedWorkspace.urlToSyllabus != "" &&
                            (
                                <Link href={selectedWorkspace.urlToSyllabus} rel="noopener noreferrer" target="_blank">
                                    <Button className="mt-4 w-full" variant={"secondary"}>
                                        Syllabus Submitted
                                    </Button>
                                </Link>
                            )
                        }
                        {selectedWorkspace?.urlToSyllabus == "" &&
                            ((<Button className="mt-4 w-full" onClick={
                                // getListDemo
                                getListDemo
                            } >
                                Submit Syllabus
                            </Button>))
                        }
                        {/* {selectedWorkspace?.urlToSyllabus == "" ||  selectedWorkspace?.urlToSyllabus != "" && ( */}
                        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                            Options with Jimmy:
                        </h2>
                        {/* )} */}
                        {/* {selectedWorkspaceName?.urlToSyllabus && selectedWorkspaceName.urlToSyllabus == "" && (
                            <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                                Options with Jimmy: {selectedWorkspaceName?.name} : {selectedWorkspaceName?.urlToSyllabus}
                            </h2>
                        )}  */}

                        <div className="pt-4 ps-2 pr-2 w-full flex flex-col gap-2">
                            <Button variant={"secondary"}> Make StudyPlan </Button>
                            <Button variant={"secondary"}> Make Notes </Button>
                            <Button variant={"secondary"}> Talk to Jimmy </Button>
                            <Button variant={"secondary"}> Zen Mode Study </Button>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
}
