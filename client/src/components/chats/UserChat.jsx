import { Stack } from "react-bootstrap";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import authorImg from '../../assets/author.svg'
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { unreadNotifications } from "../../utils/unreadNotifications";
import moment from "moment";
import { useFetchLatestMessage } from "../../hooks/useFetchLatestMessage";

const UserChat = ({ chat, user }) => {

    const { recipientUser } = useFetchRecipientUser(chat, user);
    const { onlineUsers, notifications, specificUserNotificationisRead } = useContext(ChatContext);
    const { latestMessage } = useFetchLatestMessage(chat);

    const unreadNotifs = unreadNotifications(notifications);

    const specificUserNotifications = unreadNotifs?.filter((n) => {
        return n.senderId === recipientUser?._id;
    })

    const isOnline = onlineUsers?.some((cUser) => {
        return cUser?.userId === recipientUser?._id
    })

    const truncateMessage = (message) => {
        let shortMessage = message?.substr(0, 20);

        if (message?.length > 20) {
            shortMessage = shortMessage + "...";
        }
        return shortMessage;
    }

    return (<>
        <Stack direction="horizontal" gap='3' className="user-card align-items-center p-2 justify-content-between" role="button" onClick={() => {
            if (specificUserNotifications?.length > 0) {
                specificUserNotificationisRead(specificUserNotifications, notifications);
            }
        }}>
            <div className="d-flex">
                <div className="me-2">
                    <img src={authorImg} height="35px" />
                </div>
                <div className="text-content">
                    <div className="name">
                        {recipientUser?.name}
                    </div>
                    <div className="text">
                        {latestMessage?.message && <span>
                            {truncateMessage(latestMessage.message)}
                        </span>}
                    </div>
                </div>
            </div>
            <div className="d-flex flex-column align-items-end">
                <div className={specificUserNotifications?.length > 0 ? "this-user-notifications" : ""}>
                    {specificUserNotifications?.length > 0 ? specificUserNotifications.length : ""}
                </div>
                <span className={isOnline ? "user-online" : ""}></span>
                <div className="date">{moment(latestMessage?.createdAt).calendar()}</div>
            </div>
        </Stack>
    </>);
}

export default UserChat;