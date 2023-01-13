import Footer from "@components/Footer/Footer";
import Header from "@components/Header";
import { FlexPage } from "@utils/FlexStyle";
import styled from "styled-components";
import io, { Socket } from "socket.io-client";
import { ChangeEvent, Fragment, useEffect, useRef, useState } from "react";
import { Message } from "@store/types/chat";
import { Room } from "@store/types/chat";
import { useRouter } from "next/router";
import { User } from "@store/types/user";
import { useAppSelector } from "@store/hooks/redux";
import CheckedIcon from "@public/images/message-checked.svg";
import SendedIcon from "@public/images/message-sended.svg";
import Image from "next/image";
import moment from "moment";
import Flash from "@public/images/flash.svg";
import Link from "next/link";
import { Item } from "@store/types/item";

type Timestamp = {
  time: string;
  index: number;
};

const Chat = () => {
  const chatRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [value, setValue] = useState("");
  const [socket, setSocket] = useState<Socket>();
  const [rooms, setRooms] = useState<Room[]>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<User>();
  const { userId } = useAppSelector((state) => state.loginReducer);
  const [timeStamps, setTimeStamps] = useState<Timestamp[]>([]);
  const [roomItem, setRoomItem] = useState<Item>();

  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const send = () => {
    if (currentUser) {
      socket?.emit("sendMessage", { text: value });
      setValue("");
    }
  };

  const changeRoom = (room: Room) => {
    if (rooms) {
      // Change hasSeen room to true
      const setRoomsAsSeen = rooms.map((chat) => {
        if (chat.users.id === room.users.id) {
          return {
            ...chat,
            message: {
              ...chat.message,
              markedSeen: true,
            },
          };
        }

        return chat;
      });

      setRooms(setRoomsAsSeen);
    }

    if (room.users.id) {
      socket?.emit("joinRoom", { user: room.users.id });
    }
  };

  useEffect(() => {
    const user = router.query.send || "";
    const item = router.query.item || "";

    if (user) {
      socket?.emit("joinRoom", { user, item });
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

      socket.on("getItem", (item) => {
        setRoomItem(item);
      });

      // Get chats
      socket.on("getChats", (chats: Room[]) => {
        const rooms = chats.sort((a, b) => {
          return a.message.markedSeen === b.message.markedSeen
            ? 0
            : a.message.markedSeen
            ? 1
            : -1;
        });

        console.log(rooms);
        setRooms(rooms);
      });

      socket.on("getRoomMessages", (messages: Message[]) => {
        setMessages(messages);
      });

      socket.on("onMessage", (message: Message) => {
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

  function getTimeStamps() {
    const arr: Timestamp[] = [];

    const timestamps = messages.map((message, index) => {
      const time = new Date(message.date).toLocaleString("en-US", {
        day: "2-digit",
        month: "long",
      });

      if (arr.length === 0) {
        return arr.push({ time, index });
      }

      let alreadyHas = false;

      arr.map((it) => {
        if (it.time === time) {
          alreadyHas = true;
        }
      });

      if (!alreadyHas) arr.push({ time, index });
    });

    return arr;
  }
  function getActivity(date: string) {
    const yesterday = moment().subtract(1, "day");

    const isToday = moment(new Date(date)).isSame(new Date(), "day");
    const isYesterday = moment(new Date(date)).isSame(yesterday, "day");
    const isThisWeek = moment(new Date(date)).isSame(new Date(), "week");
    const isThisMonth = moment(new Date(date)).isSame(new Date(), "month");
    const isThisYear = moment(new Date(date)).isSame(new Date(), "year");

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";
    if (isThisWeek) return "This week";
    if (isThisMonth) return "This month";
    if (isThisYear) return "This year";
  }

  useEffect(() => {
    const ref = chatRef.current;
    if (ref) {
      ref.scrollTop = ref.scrollHeight;
    }

    setTimeStamps(getTimeStamps());
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
                  className={
                    room.users.id === currentUser?.id
                      ? "room selected-room"
                      : "room"
                  }
                  key={key}
                  onClick={() => changeRoom(room)}
                >
                  <div className="left">
                    <div
                      // Set as selected to grey if chat is selected
                      className="user-photo"
                      style={{ backgroundImage: `url(${room.users.image})` }}
                    ></div>
                    <h3 className="user-name">{room.users.fullName}</h3>
                  </div>
                  <div className="user-activity">
                    {room.message.markedSeen === false && (
                      <div className="not-read-circle"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="chat">
              {currentUser && (
                <div className="chat-header">
                  <div
                    className="user-photo"
                    style={{ backgroundImage: `url(${currentUser.image})` }}
                  ></div>
                  <div className="right">
                    <Link href={`/user/${currentUser.id}`}>
                      <h2 className="user-name">{currentUser.fullName}</h2>
                    </Link>
                    <p className="user-activity">
                      <Image src={Flash} alt="Activity" />
                      Last activity{" "}
                      {getActivity(
                        currentUser?.lastActivity
                      )?.toLocaleLowerCase()}
                    </p>
                  </div>
                </div>
              )}
              {roomItem && (
                <div className="chat-item">
                  <div className="chat-item__photo"></div>
                  <Link href={`/shop/${roomItem.id}`}>
                    <Image
                      src={roomItem.images[0]}
                      alt="Item photo"
                      width={50}
                      height={50}
                    />
                  </Link>
                  <div className="right">
                    <Link href={`/shop/${roomItem.id}`}>
                      <h2 className="chat-item__name">{roomItem.name}</h2>
                    </Link>
                    <p className="chat-item__price">{roomItem.price} PLN</p>
                  </div>
                </div>
              )}
              <div className="chat-inner" ref={chatRef}>
                {messages.map((message, key) => (
                  <Fragment key={key}>
                    {timeStamps[key] && (
                      <p className="timestamp">{timeStamps[key].time}</p>
                    )}
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
                  </Fragment>
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

  .timestamp {
    text-align: center;
    color: var(--grey-60);
  }

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
        display: flex;
        align-items: center;
        gap: 0.2rem;
        margin-top: 0.2rem;
        color: var(--grey-60);
      }
    }
  }

  .not-read-circle {
    height: 10px;
    width: 10px;
    background-color: var(--primary);
    border-radius: 50%;
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

  .chat-item {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    padding: 0.5rem 0rem;
    border-bottom: 1px solid var(--grey-5);

    &__name {
      font-size: 1rem;
      color: var(--grey-60);
      font-weight: 500;
    }

    &__price {
      margin-top: 0.3rem;
      font-weight: 700;
      font-size: 0.9rem;
    }
  }

  .chat-inner {
    padding: 1rem;
    overflow-y: auto;
    max-height: 500px;
    min-height: 500px;

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
    background-position: center;
    background-size: cover;
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
      border-bottom: 1px var(--grey-5) solid;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
    }

    .selected-room {
      background-color: var(--grey-5);
    }

    .left {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
  }
`;

export default Chat;
