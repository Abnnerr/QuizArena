
import { useState } from "react";
import { useAuth } from "../../contexts/hooks/useAuth";
import { useTheme } from "../../contexts/ThemeContext";
import type { ResponseDTO } from "../../contexts/types/authTypes";
import { useNavigate } from "react-router";
import { AXIOS } from "../../service";
import { Helmet } from "react-helmet-async";
import FeedbackMessage from "../../shared/ui/FeedBackMessage";
import JoinRoomHeader from "./components/JoinRoomHeader";
import JoinRoomCard from "./components/JoinRoomCard";
import JoinRoomFooter from "./components/JoinRoomFooter";

const HomePage = () => {
    const { user } = useAuth();
    const { colors } = useTheme();

    const [roomCode, setRoomCode] = useState<string>("");
    const [feedBack, setFeedBack] = useState<ResponseDTO | null>(null);

    const navigate = useNavigate();

    async function handleJoinRoom(e: React.FormEvent) {
        e.preventDefault();

        try {
            const { data } = await AXIOS.get(`/room/${roomCode}`);

            setFeedBack({
                type: "Success",
                message: "Sala Encontrada!"
            });

            if (data.type === "Success" && user?.role_name === "host") {
                setTimeout(() => {
                    navigate(`/room/${roomCode}/lobby`);
                }, 1500);
                return;
            }

            setTimeout(() => {
                navigate(`/room/player/username/${roomCode}`);
            }, 1500);

        } catch (error: any) {
            setFeedBack({
                type: "Warning",
                message:
                    error.response?.data?.message ||
                    "Erro ao encontrar a sala ou não existe."
            });

            setTimeout(() => {
                setFeedBack(null);
            }, 2000);
        }
    }

    return (

        <>
            <Helmet>
                <title>Entrar na Sala | QuizArena</title>
            </Helmet>

            <main
                className="
            w-full h-full min-h-0
            flex flex-col items-center justify-center
            mx-auto relative z-10
            overflow-y-auto overflow-x-hidden
            max-w-2xl
            p-3 sm:p-4 lg:p-5
        "
            >
                <FeedbackMessage feedBack={feedBack} colors={colors} />

                <JoinRoomHeader colors={colors} />

                <JoinRoomCard
                    roomCode={roomCode}
                    setRoomCode={setRoomCode}
                    handleJoinRoom={handleJoinRoom}
                    isWarning={feedBack?.type === "Warning"}
                />
                <JoinRoomFooter />
            </main>
        </>

    );
};

export default HomePage;
