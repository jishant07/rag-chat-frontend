"use client"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import markdownit from 'markdown-it'

export default function LLMChat({ chat_id }: { chat_id: string }) {

    const [queryText, setQueryText] = useState<string>("")
    const [chatData, setChatData] = useState<string>("")

    const md = markdownit({
        html : true, 
        linkify: true,
        typographer: true
    })

    const handleQueryText = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setQueryText(e.target.value)
    }

    const fetchData = async (e: any) => {
        setChatData('')
        e.preventDefault()
        let headers = new Headers();
        headers.append("responseType", 'stream')
        headers.append("x-access-token", localStorage.getItem('token') || "")
        headers.append("Content-Type", "application/json")
        const response : any = fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/ask_question`, {
            method: "POST",
            body: JSON.stringify({ chat_id, query_text: queryText }),
            headers
        }).then(async (response : any) =>{
            const reader = response?.body.getReader();
            const decoder = new TextDecoder("utf-8");

            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }
                // Massage and parse the chunk of data
                const chunk = decoder.decode(value);

                console.log(chunk.toString())
                setChatData((prevState) => prevState + chunk.toString())
            }
        }).catch((err : any) =>{
            console.log(err)
        })
        // let response : any = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat/ask_question`,
        //     {chat_id, query_text : queryText},
        //     {responseType: 'stream',headers : {'x-access-token' : localStorage.getItem('token')}},
        // )

        // Read the response as a stream of data
    };
    return (
        <section>
            <form onSubmit={(e) => fetchData(e)}>
                <Textarea placeholder="Add your query here..." onChange={(event) => handleQueryText(event)} />
                <Button>Submit Query</Button>
            </form>
            <div dangerouslySetInnerHTML={{__html : md.render(chatData)}}>{}</div>
        </section>
    )
}