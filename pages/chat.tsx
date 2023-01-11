import Footer from "@components/Footer/Footer";
import Header from "@components/Header";
import { FlexPage } from "@utils/FlexStyle";
import styled from "styled-components";
import io, { Socket } from "socket.io-client";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { API_URL } from "@utils/axios";
import { Message } from "@store/types/message";
import { useRouter } from "next/router";
import { User } from "@store/types/user";
import { useAppSelector } from "@store/hooks/redux";
import CheckedIcon from "@public/images/message-checked.svg";
import SendedIcon from "@public/images/message-sended.svg";
import Image from "next/image";

const Chat = () => {
  const chatRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [value, setValue] = useState("");
  const [socket, setSocket] = useState<Socket>();
  const [rooms, setRooms] = useState<any[]>();
  const [messages, setMessages] = useState<any[]>([]);
  const [currentRoom, setCurrentRoom] = useState<any>();
  const [currentUser, setCurrentUser] = useState<User>();
  const { userId } = useAppSelector((state) => state.loginReducer);

  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const send = () => {
    if (currentUser) {
      socket?.emit("sendMessage", { text: value });
      setValue("");
    }
  };

  const changeRoom = (room: { users: { id: number } }) => {
    setCurrentRoom(room);

    if (room.users.id) {
      socket?.emit("joinRoom", room.users.id);
    }
  };

  useEffect(() => {
    const user = router.query.send || "";

    if (user) {
      socket?.emit("joinRoom", user);
      console.log("emitting");
    }
  }, [router.isReady]);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      const socket = io("http://localhost:8000", {
        auth: {
          token: accessToken,
        },
      });

      setSocket(socket);

      socket.on("connect", () => {
        console.log("connected to socket");
      });

      socket.on("disconnect", () => {
        console.log("disconnected from socket");
      });

      // Get chats
      socket.on("getChats", (chats) => {
        setRooms(chats);
      });

      socket.on("getRoomMessages", (messages: Message[]) => {
        setMessages(messages);
      });

      socket.on("onMessage", (message: Message) => {
        console.log(message);
        setMessages((prev) => [...prev, message]);
      });

      socket.on("getUser", (user: User) => {
        setCurrentUser(user);
      });

      return () => {
        socket.off("onMessage");
        socket.off("getRoomMessages");
        socket.off("getChats");
        socket.off("getUser");
        socket.off("connect");
        socket.off("disconnect");
        socket.disconnect();
        socket.off();
      };
    }
  }, []);

  useEffect(() => {
    const ref = chatRef.current;
    if (ref) {
      ref.scrollTop = ref.scrollHeight;
    }
  }, [messages]);

  return (
    <FlexPage>
      <Header />
      <ChatStyles>
        <div className="container">
          <div className="title-md">Messages id {userId}</div>
          <div className="chat-wrapper">
            <div className="rooms-wrapper">
              {rooms?.map((room, key) => (
                <div
                  className="room"
                  key={key}
                  onClick={() => changeRoom(room)}
                >
                  <div className="left">
                    <div className="user-photo"></div>
                    <h3 className="user-name">{room.users.fullName}</h3>
                  </div>
                  {/* <div className="user-activity">11:04</div> */}
                </div>
              ))}
            </div>
            <div className="chat">
              {currentUser && (
                <div className="chat-header">
                  <div className="user-photo"></div>
                  <div className="right">
                    <h2 className="user-name">{currentUser.fullName}</h2>
                    {/* <p className="user-activity">11:04</p> */}
                  </div>
                </div>
              )}
              <div className="chat-inner" ref={chatRef}>
                {messages.map((message, key) => (
                  <div
                    key={key}
                    className={
                      message.userId === userId
                        ? "message my--message"
                        : "message"
                    }
                  >
                    <div className="message-inner">
                      {message.text}
                      {message.userId === userId && message.markedSeen && (
                        <Image
                          src={CheckedIcon}
                          alt="Checked"
                          height={20}
                          width={20}
                        />
                      )}
                      {message.userId === userId && !message.markedSeen && (
                        <Image
                          src={SendedIcon}
                          alt="Checked"
                          height={20}
                          width={20}
                        />
                      )}
                    </div>
                    <p className="message-time">
                      {new Date(message.date).toLocaleString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                    </p>
                  </div>
                ))}
              </div>
              {currentUser && (
                <div className="chat-bottom">
                  <input
                    type="text"
                    className="chat-input"
                    placeholder="Type something..."
                    onChange={inputHandler}
                    value={value}
                  />
                  <button className="button" onClick={send}>
                    Send
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </ChatStyles>
      <Footer />
    </FlexPage>
  );
};

const ChatStyles = styled.div`
  width: 100%;
  margin-top: 2rem;

  .has-seen {
    width: 100%;
    text-align: end;
    margin-top: 1rem;
    color: var(--grey-60);
  }

  .chat {
    border: 1px solid var(--grey-10);
    border-radius: 0.4rem;
    position: relative;
    display: flex;
    flex-direction: column;

    .chat-header {
      padding: 1rem 1rem;
      display: flex;
      gap: 0.5rem;
      border-bottom: 1px solid var(--grey-10);

      .user-name {
        font-size: 1.2rem;
      }

      .user-activity {
        font-size: 1rem;
        color: var(--grey-60);
      }
    }
  }

  .chat-bottom {
    display: flex;
    margin-top: auto;

    .chat-input {
      padding-left: 1rem;
      width: 100%;
      outline: none;
      border: none;
      border: 1px solid var(--grey-10);
      border-bottom: none;
      border-left: none;
      border-right-style: none;
      font-size: 1.1rem;
    }
  }

  .chat-inner {
    padding: 1rem;
    overflow-y: auto;
    max-height: 500px;

    .message {
      margin-bottom: 0.5rem;

      .message-inner {
        background-color: var(--bg-grey);
        width: fit-content;
        max-width: 15rem;
        border-radius: 0.4rem;
        padding: 0.7em 0.6em;
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .message-time {
        margin-top: 0.5rem;
        font-size: 1rem;
      }
    }

    .my--message {
      display: flex;
      align-items: end;
      flex-direction: column;

      .message-inner {
        background-color: var(--blue-msg);
      }
    }
  }

  .user-photo {
    height: 2.5rem;
    width: 2.5rem;
    border-radius: 50%;
    background-color: var(--loading);
  }

  .chat-wrapper {
    margin-top: 2rem;
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-column-gap: 1rem;
    height: 500px;
  }

  .rooms-wrapper {
    border: 1px solid var(--grey-10);
    border-radius: 0.4rem;
    overflow-y: auto;

    .room {
      padding: 1rem;
      background-color: var(--grey-5);
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
    }

    .left {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
  }
`;

export default Chat;
