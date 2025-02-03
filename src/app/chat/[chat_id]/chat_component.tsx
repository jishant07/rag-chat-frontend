"use client"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import markdownit from 'markdown-it'
import axios from "axios"

export default function LLMChat({ chat_id }: { chat_id: string }) {

    const [queryText, setQueryText] = useState<string>("")
    const [chatMessages, setChatMessages] = useState<any[]>([])

    useEffect(() =>{
        getChatMessages()
    },[])

    const getChatMessages = async () =>{
        let result = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat/list_chat_messages`,
            {chat_id},
            { headers: { 'x-access-token': localStorage.getItem('token') } }
        )
        setChatMessages(result.data.chat_messages)
    }

    const md = markdownit({
        html : true, 
        linkify: true,
        typographer: true
    })

    const handleQueryText = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setQueryText(e.target.value)
    }

    const saveChatMessage = async (message_by : string, message_text : string) =>{
        let results = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat/save_chat_message`,
            {
                message_by, message_text, chat_id
            },
            { headers: { 'x-access-token': localStorage.getItem('token') } }
        )
    }

    const fetchData = async (e: any) => {
        e.preventDefault()
        saveChatMessage("user", queryText)
        let userMessage = {
            message_by : "user",
            message_text : queryText,
            created : "TIMESTAMP"
        }
        let dummmyAgentMessage = {
            message_by : "agent",
            message_text : "",
            created : "TIMESTAMP"
        }
        setChatMessages((prevState) => [...prevState, userMessage, dummmyAgentMessage])
        setQueryText('')
        let headers = new Headers();
        headers.append("responseType", 'stream')
        headers.append("x-access-token", localStorage.getItem('token') || "")
        headers.append("Content-Type", "application/json")
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/ask_question`, {
            method: "POST",
            body: JSON.stringify({ chat_id, query_text: queryText }),
            headers
        }).then(async (response : any) =>{
            const reader = response?.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let accumulatedData = ""

            while (true) {
                const { done, value } = await reader.read();
                // Massage and parse the chunk of data
                const chunk = decoder.decode(value);
                if (done) {
                    break;
                }

                accumulatedData += chunk.toString()
                
                setChatMessages((prevMessages) => {
                    const updatedMessages = [...prevMessages];
                    updatedMessages[updatedMessages.length - 1] = {
                        ...updatedMessages[updatedMessages.length - 1],
                        message_text: accumulatedData,
                    };
                    return updatedMessages;
                });
            }
            saveChatMessage("agent", accumulatedData)
        }).catch((err : any) =>{
            console.log(err)
        })
    };
    return (
        <section>
            <form onSubmit={(e) => fetchData(e)}>
                <Textarea placeholder="Add your query here..." value={queryText} onChange={(event) => handleQueryText(event)} />
                <Button>Submit Query</Button>
            </form>
            <div>
                {
                    chatMessages.map((chat : any) =>{
                        return (
                            <p dangerouslySetInnerHTML={{__html : md.render(chat.message_text)}}></p>
                        )
                    })
                }
            </div>
        </section>
    )
}