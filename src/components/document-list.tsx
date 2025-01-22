"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import axios from "axios"
import { ColorRing } from 'react-loader-spinner'
import { Plus, Target } from 'lucide-react'
import { Button } from "./ui/button"
import { toast } from "@/hooks/use-toast"
import { Checkbox } from "./ui/checkbox"
import { Input } from "./ui/input"
import { useRouter } from "next/navigation"

export const DocumentList = () => {

    const [documentList, setDocumentList] = useState<any[]>([])
    const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true)
    const [file, setFile] = useState("")
    const [fileName, setFileName] = useState("")
    const hiddenFileInput = useRef<HTMLInputElement>(null)
    const [selectedDocuments, setSelectedDocuments] = useState<any[]>([])
    const [chatTitle, setChatTitle] = useState<string>("")
    const router = useRouter()

    useEffect(() => {
        getDocuments()
    }, [])

    useEffect(() =>{
        let interval = setInterval(() =>{
            getDocuments()
        },5000)

        return () => clearInterval(interval)
    },[documentList])

    const getDocuments = async () => {
        let results = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/document/list_documents`, { headers: { 'x-access-token': localStorage.getItem('token') } })
        setDocumentList(results.data.user_documents)
        if(isFirstLoad){
            setIsFirstLoad(false)
        }
    }

    const handleFileClick = (e: any) => {
        hiddenFileInput.current?.click();
    }

    const handleFileChange = (event: any) => {
        const fileUploaded = event.target.files[0];
        setFile(fileUploaded)
        setFileName(fileUploaded.name)
    };

    const handleCheckboxChange = (document_id : string) =>{
        let temp = selectedDocuments

        if(temp.includes(document_id)){
            temp = temp.filter((item) => {return item != document_id})
        }else{
            temp.push(document_id)
        }

        setSelectedDocuments((prevState) => [...temp])
    }

    const createChat = async () =>{
        try {
            if(chatTitle != ""){
                let results = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat/create_chat`, 
                    {
                        selected_documents : selectedDocuments,
                        chat_title : chatTitle
                    }, 
                    {headers : {'x-access-token' : localStorage.getItem('token')}})
                
                toast({
                    title: "Chat Created Successfully",
                    description : results?.data?.message
                })
                router.push(`/chat/${results?.data?.chat_id}`)
            }else{
                toast({
                    title: "Chat Creation Failed",
                    description: "Chat Title Empty",
                    variant : "destructive"
                })    
            }
        }catch(e : any){
            toast({
                title: "Something went wrong",
                description: e?.response?.data?.message,
                variant : "destructive"
            })
        }
    }

    const uploadFile = async (e: any) => {

        e.preventDefault()
        let formData = new FormData()
        formData.append('file', file)
        try {
            let result = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/document/upload`, formData, { headers: { 'x-access-token': localStorage.getItem('token') } })
            toast({
                title: "File Upload Successful",
                description: result?.data?.message
            })
            setFile('')
            setFileName('')
        } catch (e: any) {
            toast({
                "title": "Some Error Occured",
                "description": e?.response?.data.message,
                variant: "destructive"
            })
        }

    }

    const handleChatTitleInput = (e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setChatTitle(e?.target?.value)
    }

    return (
        <div className={isFirstLoad ? "m-auto" : ""}>
            {
                !isFirstLoad ?

                    <div className="container grid grid-cols-3 gap-3">
                        {
                            documentList.map((document: any, index: number) => (
                                <Card key={document.document_id}>
                                    <CardHeader>
                                        <CardTitle>{document.name}</CardTitle>
                                        <CardDescription>Document: {document.is_active ? "Active" : "In-Active"}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {document?.is_active ?
                                            <Checkbox 
                                                value={document.document_id} 
                                                onClick={() => handleCheckboxChange(document.document_id)}
                                            /> : 
                                                null
                                        }
                                    </CardContent>
                                </Card>
                            ))
                        }
                        <Card onClick={(e) => file == "" && handleFileClick(e)}>
                            <CardHeader>
                                <CardTitle>Add New Document</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="d-flex align-center justify-content m-auto">
                                    {
                                        fileName == "" ?
                                            <Plus /> :
                                            <div>
                                                <h5>{fileName}</h5>
                                                <Button onClick={(e) => uploadFile(e)}>Upload</Button>
                                            </div>
                                    }
                                </div>
                                <form>
                                    <input
                                        type="file"
                                        ref={hiddenFileInput}
                                        hidden
                                        name="file"
                                        id="file"
                                        defaultValue={file}
                                        onChange={(e) => handleFileChange(e)}
                                    />
                                </form>
                            </CardContent>
                        </Card>
                    </div>: <ColorRing
                        visible={true}
                        height="80"
                        width="80"
                        ariaLabel="color-ring-loading"
                        wrapperStyle={{}}
                        wrapperClass="color-ring-wrapper"
                        colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                    />
            }
            {selectedDocuments.length ? 
                <div className="grid grid-cols-3 gap-3 py-4">
                    <h4>Create Chat with Selected Document: </h4>
                    <div>
                        <Input 
                            type="text"
                            name="chatTitle"
                            placeholder="Add Chat Title Here (required)"
                            onChange={(e) => handleChatTitleInput(e)}
                        />
                    </div>
                    <div>
                        <Button onClick={() => createChat()}>
                            Create Chat!
                        </Button>
                    </div>
                </div> : null
            }
        </div>
    )
}