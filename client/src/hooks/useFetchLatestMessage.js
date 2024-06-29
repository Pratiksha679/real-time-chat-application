import { useContext, useEffect, useState } from "react"
import { ChatContext } from "../context/ChatContext"
import { baseUrl, getRequest } from "../utils/services";

export const useFetchLatestMessage = (chat) => {
    const { newMessage, notifications } = useContext(ChatContext);
    const [latestMessage, setLatestMessage] = useState({});

    useEffect(() => {
        const getMessages = async () => {
            const response = await getRequest(`${baseUrl}/messages/${chat?._id}`);
            if (response.error) {
                return console.log("Error fetching the response", response);
            }

            const lastMessage = response[response?.length - 1];
            setLatestMessage(lastMessage);
        }
        getMessages();
    }, [newMessage, notifications])

    return { latestMessage };
}