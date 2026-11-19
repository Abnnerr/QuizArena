
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

import { useTheme } from "../../../../contexts/ThemeContext";
import { useAuth } from "../../../../contexts/hooks/useAuth";
import AccountTopbar from "./components/AccountTopbar";
import AccountBanner from "./components/AccountBanner";
import FeedbackMessage from "../../../../shared/ui/FeedBackMessage";
import RoomsSection from "./components/RoomsSection";
import PasswordForm from "./components/PasswordForm";
import { AXIOS } from "../../../../service";

interface Room {
    room_id: number;
    room_code: string;
    room_name: string;
    max_players: number;
    room_mode: "NORMAL" | "HARDCORE";
    room_status: "LOBBY" | "LIVE" | "FINISHED";
}

interface UserProfile {
    user_username: string;
    user_email: string;
}

interface Feedback {
    type: "Success" | "Warning" | "Error";
    message: string;
}

const UserPage = () => {
    const { colors } = useTheme();
    const { profile } = useAuth();

    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);

    // Busca os dados do perfil
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setProfileLoading(true);

                const response = await profile();

                if (response?.type === "Success") {
                    setUserProfile({
                        user_username: response.data.user_username,
                        user_email: response.data.user_email,
                    });

                    setRooms(response.data.hostedRooms ?? []);
                } else {
                    setFeedback({
                        type: "Error",
                        message:
                            response?.message ||
                            "Não foi possível carregar seus dados.",
                    });
                }
            } catch (error) {
                console.error("Erro ao buscar perfil:", error);

                setFeedback({
                    type: "Error",
                    message: "Erro ao carregar os dados da sua conta.",
                });
            } finally {
                setProfileLoading(false);
            }
        };

        fetchProfile();
    }, [profile]);

    // Alteração de senha
    const handlePasswordSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        setFeedback(null);

        if (!currentPassword || !newPassword || !confirmPassword) {
            setFeedback({
                type: "Warning",
                message: "Preencha todos os campos.",
            });
            return;
        }

        if (newPassword.length < 8) {
            setFeedback({
                type: "Warning",
                message: "A nova senha precisa ter pelo menos 8 caracteres.",
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            setFeedback({
                type: "Warning",
                message: "As senhas não coincidem.",
            });
            return;
        }

        if (currentPassword === newPassword) {
            setFeedback({
                type: "Warning",
                message: "A nova senha deve ser diferente da senha atual.",
            });
            return;
        }

        try {
            setLoading(true);

            const { data } = await AXIOS.patch("/auth/updatePassword", {
                currentPassword,
                newPassword,
            });

            setFeedback({
                type: data.type,
                message: data.message,
            });

            if (data.type === "Success") {
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }

        } catch (error: any) {
            setFeedback({
                type: "Warning",
                message:
                    error.response?.data?.message ??
                    "Não foi possível atualizar sua senha.",
            });
        } finally {
            setLoading(false);
        }
    };
    // Copiar código da sala
    const handleCopyCode = async (code: string) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedCode(code);

            window.setTimeout(() => {
                setCopiedCode((current) =>
                    current === code ? null : current
                );
            }, 2000);
        } catch {
            setFeedback({
                type: "Error",
                message: "Não foi possível copiar o código da sala.",
            });
        }
    };

    const statusConfig: Record<Room["room_status"], { label: string; color: string }> = {
        LOBBY: {
            label: "Aguardando",
            color: colors.primary,
        },
        LIVE: {
            label: "Em andamento",
            color: colors.success,
        },
        FINISHED: {
            label: "Finalizada",
            color: colors.muted,
        },
    };

    return (
        <>
            <Helmet>
                <title>QuizArena • Minha Conta</title>
            </Helmet>

            <div
                className="
                    w-full max-w-5xl mx-auto px-4
                    flex flex-col items-center
                    flex-shrink-0 relative z-10
                    py-3 sm:py-4
                "
            >
                <AccountTopbar colors={colors} />

                <AccountBanner
                    colors={colors}
                    userProfile={userProfile}
                />

                <FeedbackMessage
                    feedBack={feedback}
                    colors={colors}
                />

                <PasswordForm
                    colors={colors}
                    currentPassword={currentPassword}
                    setCurrentPassword={setCurrentPassword}
                    newPassword={newPassword}
                    setNewPassword={setNewPassword}
                    confirmPassword={confirmPassword}
                    setConfirmPassword={setConfirmPassword}
                    showCurrentPassword={showCurrentPassword}
                    setShowCurrentPassword={setShowCurrentPassword}
                    showNewPassword={showNewPassword}
                    setShowNewPassword={setShowNewPassword}
                    showConfirmPassword={showConfirmPassword}
                    setShowConfirmPassword={setShowConfirmPassword}
                    loading={loading}
                    handlePasswordSubmit={handlePasswordSubmit}
                />

                <RoomsSection
                    colors={colors}
                    rooms={rooms}
                    profileLoading={profileLoading}
                    statusConfig={statusConfig}
                    copiedCode={copiedCode}
                    handleCopyCode={handleCopyCode}
                />
            </div>
        </>
    );
};

export default UserPage;
