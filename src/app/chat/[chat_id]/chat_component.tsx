"use client"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import axios from 'axios'

export default async function LLMChat({chat_id}: {chat_id : string}) {

    const [queryText, setQueryText] = useState<string>('What is Spark and how is it useful in managing Big Data?')

    const handleQueryText = (e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
        setQueryText(e.target.value)
    }

    const fetchData = async (e : any) => {
        e.preventDefault()
        let response : any = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat/ask_question`,
            {chat_id, query_text : queryText},
            {headers : {'x-access-token' : localStorage.getItem('token')}}
        )

        console.log(response)
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let receivedText = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            receivedText += decoder.decode(value, { stream: true });
            console.log('Chunk received:', decoder.decode(value));
        }
      };
    return (
        <div>
            <form onSubmit={(e) => fetchData(e)}>
                <Textarea placeholder="Add your query here..." onChange={(event) => handleQueryText(event)}/>
                <Button>Submit Query</Button>
            </form>
        </div>
    )
}