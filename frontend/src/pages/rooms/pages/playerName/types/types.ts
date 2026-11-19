
export interface PlayerNameInputProps {
    playerName: string;
    setPlayerName: (value: string) => void;
}

export interface PlayerNameFormProps {
    playerName: string;
    setPlayerName: (value: string) => void;
    loading: boolean;
    handleSubmit: React.FormEventHandler<HTMLFormElement>;
}
