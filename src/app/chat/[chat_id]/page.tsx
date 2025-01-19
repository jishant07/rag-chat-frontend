import LLMChat from "./chat_component"

export default async function ChatPage({params} : {params : {chat_id : string}}){

    const {chat_id} = await params

    return (
        <LLMChat chat_id = {chat_id}/>
    )

} 