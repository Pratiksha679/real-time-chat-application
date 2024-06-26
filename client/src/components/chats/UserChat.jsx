import { Stack } from "react-bootstrap";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import authorImg from '../../assets/author.svg'
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";

const UserChat = ({ chat, user }) => {

    const { recipientUser } = useFetchRecipientUser(chat, user);
    const { onlineUsers } = useContext(ChatContext);

    const isOnline = onlineUsers?.some((cUser) => {
        return cUser?.userId === recipientUser?._id
    })

    return (<>
        <Stack direction="horizontal" gap='3' className="user-card align-items-center p-2 justify-content-between">
            <div className="d-flex">
                <div className="me-2">
                    <img src={authorImg} height="35px" role="button" />
                </div>
                <div className="text-content">
                    <div className="name">
                        {recipientUser?.name}
                    </div>
                    <div className="text">
                        Text
                    </div>
                </div>
            </div>
            <div className="d-flex flex-column align-items-end">
                <span className={isOnline ? "user-online" : ""}></span>
            </div>
        </Stack>
    </>);
}

export default UserChat;