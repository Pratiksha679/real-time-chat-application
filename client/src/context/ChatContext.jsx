import { createContext, useCallback, useEffect, useState } from "react"
import { getRequest, baseUrl, postRequest } from "../utils/services"
import { AuthContextProvider } from "./AuthContext";
import { io } from 'socket.io-client'

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);
    const [sendTextMessageError, setSendTextMessageError] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        const newSocket = io("http://localhost:3000");
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        }
    }, [user]);

    useEffect(() => {
        if (socket === null) return;
        socket.emit("addNewUser", user?.id);
        socket.on("getOnlineUsers", (res) => {
            setOnlineUsers(res);
        });

        return () => {
            socket.off("getOnlineUsers");
        }
    }, [socket]);

    //send message
    useEffect(() => {
        if (socket === null) return;
        const recipientId = currentChat?.members.find((member) => {
            return member != user.id;
        })
        socket.emit("sendMessage", { ...newMessage, recipientId });
    }, [newMessage]);

    //receive message and notification
    useEffect(() => {
        if (socket === null) return;
        socket.on("getMessage", res => {
            if (currentChat?._id !== res.chatId) return;

            setMessages((prev) => [...prev, res]);
        });

        socket.on("getNotification", res => {
            const isChatOpened = currentChat?.members.some((id) => {
                return id === res.senderId;
            });
            if (isChatOpened) {
                setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
            }
            else {
                setNotifications((prev) => [res, ...prev])
            }
        });
        return () => {
            socket.off("getMessage");
            socket.off("getNotification");
        }
    }, [socket, currentChat]);

    useEffect(() => {
        const getUsersChat = async () => {
            if (user?.id) {
                setIsUserChatsLoading(true);
                setUserChatsError(null);
                const response = await getRequest(`${baseUrl}/chats/${user.id}`);
                setIsUserChatsLoading(false);
                if (response.error) {
                    return setUserChatsError(response);
                }
                setUserChats(response);
            }
        }
        getUsersChat();
    }, [user, notifications])

    useEffect(() => {
        const getMessages = async () => {
            setIsMessagesLoading(true);
            setMessagesError(null);
            const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`);
            setIsMessagesLoading(false);
            if (response.error) {
                return setMessagesError(response);
            }
            setMessages(response);
        }
        getMessages();
    }, [currentChat])


    useEffect(() => {
        const getUsers = async () => {
            const response = await getRequest(`${baseUrl}/users`);

            if (response.error) {
                return console.log("Error fetching the users", response.error);
            }

            setAllUsers(response);

            const pChats = response.filter((currentUser) => {
                let isChatCreated = false;
                if (currentUser._id == user?.id) return false;

                if (userChats) {
                    isChatCreated = userChats?.some((chat) => {
                        return chat.members[0] === currentUser._id ||
                            chat.members[1] === currentUser._id
                    })
                }
                return !isChatCreated;
            });
            setPotentialChats(pChats);
        }
        getUsers();
    }, [userChats]);

    const createChat = useCallback(async (firstId, secondId) => {
        const response = await postRequest(`${baseUrl}/chats/`, JSON.stringify({ firstId, secondId }));
        if (response.error) {
            return console.log("Error creating chat", response);
        }
        setUserChats((prev) => [response, ...prev]);
    }, []);

    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat);
    }, [])

    const sendTextMessage = useCallback(async (textMessage, sender, currentChatId, setTextMessage) => {
        if (!textMessage) {
            return console.log("You must type something");
        }
        const response = await postRequest(`${baseUrl}/messages`, JSON.stringify({
            chatId: currentChatId,
            senderId: sender.id,
            message: textMessage,
        }));

        if (response.error) {
            return setSendTextMessageError(response);
        }

        setNewMessage(response);
        setMessages((prev) => [...prev, response]);
        setTextMessage("");
    }, [])


    const markAllNotificationsAsRead = useCallback((notifications) => {
        const modifiedNotifications = notifications.map((n) => {
            return {
                ...n,
                isRead: true
            }
        });
        setNotifications(modifiedNotifications);
    }, [])

    const markNotificationAsRead = useCallback((currentNotification, userChats, user, notifications) => {
        const chatToOpen = userChats?.find((chat) => {
            const chatMembers = [user.id, currentNotification.senderId];
            const isDesiredChat = chat?.members.every((member) => {
                return chatMembers.includes(member);
            })
            return isDesiredChat;
        });

        const modifiedNotifications = notifications.map((n) => {
            if (currentNotification.senderId === n.senderId) {
                return {
                    ...currentNotification,
                    isRead: true
                }
            }
            else {
                return n;
            }
        })
        updateCurrentChat(chatToOpen);
        setNotifications(modifiedNotifications);
    }, [])

    const specificUserNotificationisRead = useCallback((specificUserNotifications, notifications) => {
        const modifiedNotifications = notifications.map((n) => {
            let notification;

            specificUserNotifications.forEach((notificationElement) => {
                if (notificationElement.senderId === n.senderId) {
                    notification = { ...notificationElement, isRead: true }
                }
                else {
                    notification = n;
                }
            })
            return notification;
        })
        setNotifications(modifiedNotifications);
    })

    return (<ChatContext.Provider value={{ userChats, isUserChatsLoading, userChatsError, potentialChats, createChat, updateCurrentChat, currentChat, messages, isMessagesLoading, messagesError, sendTextMessage, onlineUsers, notifications, allUsers, markAllNotificationsAsRead, markNotificationAsRead, specificUserNotificationisRead }}>
        {children}
    </ChatContext.Provider >
    )
}