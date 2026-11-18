

export interface UserProfile {
    user_username: string;
    user_email: string;
}

export interface Room {
    room_id: number;
    room_name: string;
    room_code: string;
    room_status: "LOBBY" | "LIVE" | "FINISHED";
    room_mode: "NORMAL" | "HARDCORE";
    max_players: number;
}

export interface RoomStatus {
    label: string;
    color: string;
}

export type RoomStatusConfig = Record<Room["room_status"], RoomStatus>;

export interface AccountFeedbackData {
    message: string;
}

export interface PasswordFormProps {
    currentPassword: string;
    setCurrentPassword: React.Dispatch<React.SetStateAction<string>>;
    newPassword: string;
    setNewPassword: React.Dispatch<React.SetStateAction<string>>;
    confirmPassword: string;
    setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
    showCurrentPassword: boolean;
    setShowCurrentPassword: React.Dispatch<React.SetStateAction<boolean>>;
    showNewPassword: boolean;
    setShowNewPassword: React.Dispatch<React.SetStateAction<boolean>>;
    showConfirmPassword: boolean;
    setShowConfirmPassword: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
    handlePasswordSubmit: (
        event: React.FormEvent<HTMLFormElement>
    ) => void | Promise<void>;
}