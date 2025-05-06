import LLMChat from "./chat_component";

export default async function ChatPage({ params }: { params: { chat_id: string } }) {
    const { chat_id } = await params;

    return (
        <div className="w-full bg-gray-800">
            <LLMChat chat_id={chat_id} />
        </div>
    );
}
