"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import markdownit from "markdown-it";
import axios from "axios";

export default function LLMChat({ chat_id }: { chat_id: string }) {
    const [queryText, setQueryText] = useState<string>("");
    const [chatMessages, setChatMessages] = useState<any[]>([]);

    useEffect(() => {
        getChatMessages();
    }, []);

    const getChatMessages = async () => {
        let result = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat/list_chat_messages`, { chat_id }, { headers: { "x-access-token": localStorage.getItem("token") } });
        setChatMessages(result.data.chat_messages);
    };

    const md = markdownit({
        html: true,
        linkify: true,
        typographer: true,
    });

    const handleQueryText = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setQueryText(e.target.value);
    };

    const saveChatMessage = async (message_by: string, message_text: string) => {
        let results = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/chat/save_chat_message`,
            {
                message_by,
                message_text,
                chat_id,
            },
            { headers: { "x-access-token": localStorage.getItem("token") } }
        );
    };

    const fetchData = async (e: any) => {
        e.preventDefault();
        saveChatMessage("user", queryText);
        let userMessage = {
            message_by: "user",
            message_text: queryText,
            created: "TIMESTAMP",
        };
        let dummmyAgentMessage = {
            message_by: "agent",
            message_text: "",
            created: "TIMESTAMP",
        };
        setChatMessages((prevState) => [...prevState, userMessage, dummmyAgentMessage]);
        setQueryText("");
        let headers = new Headers();
        headers.append("responseType", "stream");
        headers.append("x-access-token", localStorage.getItem("token") || "");
        headers.append("Content-Type", "application/json");
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/ask_question`, {
            method: "POST",
            body: JSON.stringify({ chat_id, query_text: queryText }),
            headers,
        })
            .then(async (response: any) => {
                const reader = response?.body.getReader();
                const decoder = new TextDecoder("utf-8");
                let accumulatedData = "";

                while (true) {
                    const { done, value } = await reader.read();
                    // Massage and parse the chunk of data
                    const chunk = decoder.decode(value);
                    if (done) {
                        break;
                    }

                    accumulatedData += chunk.toString();

                    setChatMessages((prevMessages) => {
                        const updatedMessages = [...prevMessages];
                        updatedMessages[updatedMessages.length - 1] = {
                            ...updatedMessages[updatedMessages.length - 1],
                            message_text: accumulatedData,
                        };
                        return updatedMessages;
                    });
                }
                saveChatMessage("agent", accumulatedData);
            })
            .catch((err: any) => {
                console.log(err);
            });
    };
    return (
        <section className="flex flex-col max-w-3xl mx-auto h-screen p-4 bg-gray-800 dark:bg-gray-900">
            <div className="flex-1 overflow-y-auto bg-gray-800 dark:bg-gray-800 p-4 rounded-md mb-4 space-y-4 shadow-inner">
                {chatMessages.map((chat: any, index: number) => (
                    <div key={index} className={`flex ${chat.message_by === "user" ? "justify-end" : "justify-start"} items-center`}>
                        <div className={`max-w-xs md:max-w-md p-3 items-center justify-center flex rounded-2xl shadow whitespace-pre-wrap break-words ${chat.message_by === "user" ? "bg-gray-700 text-gray-300" : "bg-gray-900 text-gray-300"} font-semibold`} dangerouslySetInnerHTML={{ __html: md.render(chat.message_text) }} />
                    </div>
                ))}
            </div>

            <form onSubmit={(e) => fetchData(e)} className="flex items-center gap-2 border-0 border-gray-300 dark:border-gray-700 pt-4">
                <Textarea className="flex-1 resize-none p-2  border-gray-300 dark:border-gray-700 dark:bg-gray-80 border-0 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-gray-300 dark:focus:ring-gray-500 bg-gray-700 text-gray-300" placeholder="Add your query here..." value={queryText} onChange={(event) => handleQueryText(event)} rows={2} />
                <Button className=" hover:bg-gray-600  rounded-md bg-gray-700 text-gray-300 font-semibold">Submit Query</Button>
            </form>
        </section>
    );
}
