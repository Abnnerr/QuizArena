import { useState } from "react";
import type { FormEvent } from "react";
import { AXIOS } from "../../../service";
import { useNavigate } from "react-router";

export interface AlternativeDTO {
    text: string;
    isCorrect: boolean;
}

export interface QuestionDTO {
    text: string;
    alternatives: AlternativeDTO[];
}

export interface RoomCreateDTO {
    name: string;
    maxPlayers: number;
    timeLimit: number;
    mode: "NORMAL" | "HARDCORE";
    questions: QuestionDTO[];
}

const createEmptyAlternative = (): AlternativeDTO => ({
    text: "",
    isCorrect: false,
});

const createEmptyQuestion = (): QuestionDTO => ({
    text: "",
    alternatives: [
        { text: "", isCorrect: true },
        createEmptyAlternative(),
    ],
});

export const useRoomCreate = () => {
    const navigate = useNavigate()
    const [name, setName] = useState("");
    const [maxPlayers, setMaxPlayers] = useState(4);
    const [timeLimit, setTimeLimit] = useState(1);
    const [mode, setMode] = useState<"NORMAL" | "HARDCORE">(
        "NORMAL"
    );

    const [questions, setQuestions] = useState<QuestionDTO[]>([
        createEmptyQuestion(),
    ]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Gerencia a troca de modo e trava o limite máximo de tempo correspondente
    const handleModeChange = (newMode: "NORMAL" | "HARDCORE") => {
        setMode(newMode);
        const maxTime = newMode === "HARDCORE" ? 15 : 20;
        if (timeLimit > maxTime) {
            setTimeLimit(maxTime);
        }
    };

    // Garante que o input manual do tempo também não ultrapasse o teto do modo atual
    const handleTimeLimitChange = (value: number) => {
        const maxTime = mode === "HARDCORE" ? 15 : 20;
        if (value > maxTime) {
            setTimeLimit(maxTime);
        } else if (value < 1) {
            setTimeLimit(1);
        } else {
            setTimeLimit(value);
        }
    };

    const handleAddQuestion = () => {
        setQuestions((prev) => [
            ...prev,
            createEmptyQuestion(),
        ]);
    };

    const handleRemoveQuestion = (qIndex: number) => {
        setQuestions((prev) =>
            prev.filter((_, index) => index !== qIndex)
        );
    };

    const handleQuestionChange = (
        qIndex: number,
        text: string
    ) => {
        setQuestions((prev) =>
            prev.map((question, index) =>
                index === qIndex
                    ? { ...question, text }
                    : question
            )
        );
    };

    const handleAddAlternative = (qIndex: number) => {
        setQuestions((prev) =>
            prev.map((question, index) => {
                if (index !== qIndex) return question;

                // Não permite criar mais de 4 alternativas
                if (question.alternatives.length >= 4) {
                    return question;
                }

                return {
                    ...question,
                    alternatives: [
                        ...question.alternatives,
                        createEmptyAlternative(),
                    ],
                };
            })
        );
    };

    const handleRemoveAlternative = (
        qIndex: number,
        aIndex: number
    ) => {
        setQuestions((prev) =>
            prev.map((question, index) => {
                if (index !== qIndex) return question;

                const alternatives = question.alternatives.filter(
                    (_, altIndex) => altIndex !== aIndex
                );

                if (
                    alternatives.length > 0 &&
                    !alternatives.some((alt) => alt.isCorrect)
                ) {
                    alternatives[0] = {
                        ...alternatives[0],
                        isCorrect: true,
                    };
                }

                return { ...question, alternatives };
            })
        );
    };

    const handleAlternativeChange = (
        qIndex: number,
        aIndex: number,
        text: string
    ) => {
        setQuestions((prev) =>
            prev.map((question, index) =>
                index === qIndex
                    ? {
                        ...question,
                        alternatives: question.alternatives.map(
                            (alternative, altIndex) =>
                                altIndex === aIndex
                                    ? { ...alternative, text }
                                    : alternative
                        ),
                    }
                    : question
            )
        );
    };

    const handleSetCorrectAlternative = (
        qIndex: number,
        aIndex: number
    ) => {
        setQuestions((prev) =>
            prev.map((question, index) =>
                index === qIndex
                    ? {
                        ...question,
                        alternatives: question.alternatives.map(
                            (alternative, altIndex) => ({
                                ...alternative,
                                isCorrect: altIndex === aIndex,
                            })
                        ),
                    }
                    : question
            )
        );
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError("Informe o nome da sala.");
            return;
        }

        if (
            !Number.isInteger(maxPlayers) ||
            maxPlayers < 2 ||
            maxPlayers > 20
        ) {
            setError("O número de jogadores deve ser entre 2 e 20.");
            return;
        }

        const maxAllowedTime = mode === "HARDCORE" ? 15 : 20;
        if (
            !Number.isInteger(timeLimit) ||
            timeLimit < 1 ||
            timeLimit > maxAllowedTime
        ) {
            setError(`O tempo por questão no modo ${mode} deve ser entre 1 e ${maxAllowedTime} segundos.`);
            return;
        }

        if (questions.length === 0) {
            setError("Adicione pelo menos uma pergunta.");
            return;
        }

        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];

            if (!question.text.trim()) {
                setError(`Preencha o enunciado da pergunta ${i + 1}.`);
                return;
            }

            if (question.alternatives.length < 2) {
                setError(
                    `A pergunta ${i + 1} precisa de pelo menos 2 alternativas.`
                );
                return;
            }

            if (question.alternatives.length > 4) {
                setError(
                    `A pergunta ${i + 1} pode ter no máximo 4 alternativas.`
                );
                return;
            }

            if (
                question.alternatives.some((alt) => !alt.text.trim())
            ) {
                setError(
                    `Preencha todas as alternativas da pergunta ${i + 1}.`
                );
                return;
            }

            const correctCount = question.alternatives.filter(
                (alt) => alt.isCorrect
            ).length;

            if (correctCount !== 1) {
                setError(
                    `Marque exatamente uma alternativa correta na pergunta ${i + 1}.`
                );
                return;
            }
        }

        const payload: RoomCreateDTO = {
            name: name.trim(),
            maxPlayers,
            timeLimit,
            mode,
            questions: questions.map((question) => ({
                text: question.text.trim(),
                alternatives: question.alternatives.map(
                    (alternative) => ({
                        text: alternative.text.trim(),
                        isCorrect: alternative.isCorrect,
                    })
                ),
            })),
        };

        try {
            setLoading(true);

            const { data } = await AXIOS.post("/room/create", payload);

            if (data.type === "Success") {
                navigate(`/room/${data.data}/lobby`)
            }
        } catch (err: any) {
            console.error("Erro ao criar sala:", err);

            setError(
                err?.response?.data?.message ??
                "Não foi possível criar a sala. Tente novamente."
            );
        } finally {
            setLoading(false);
        }
    };

    return {
        name,
        setName,
        maxPlayers,
        setMaxPlayers,
        timeLimit,
        setTimeLimit: handleTimeLimitChange,
        mode,
        setMode: handleModeChange,
        questions,
        loading,
        error,
        handleAddQuestion,
        handleRemoveQuestion,
        handleQuestionChange,
        handleAddAlternative,
        handleRemoveAlternative,
        handleAlternativeChange,
        handleSetCorrectAlternative,
        handleSubmit,
    };
};