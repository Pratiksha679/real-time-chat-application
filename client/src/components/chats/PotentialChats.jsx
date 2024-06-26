import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const PotentialChats = () => {
    const { user } = useContext(AuthContext);
    const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);
    return (<>
        <div className="all-users">
            {potentialChats && potentialChats.map((currentUser, index) => {
                return (<div key={index} className="single-user" onClick={() => {
                    createChat(user?.id, currentUser._id)
                }}>
                    {currentUser.name}
                    <span className={onlineUsers?.some((cUser) => {
                        return cUser?.userId === currentUser?._id
                    }) ? "user-online" : ""}></span>
                </div>
                )
            })}
        </div>
    </>);
}

export default PotentialChats;