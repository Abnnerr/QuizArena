import { useState } from 'react';
import { useNavigate } from 'react-router';
import type { ResponseDTO } from '../../../contexts/types/authTypes';
import { AXIOS } from '../../../service';

export const useRoomCreate = () => {
    const navigate = useNavigate();

    const [name, setName] = useState<string>('');
    const [maxPlayers, setMaxPlayers] = useState<number>(4);
    const [timeLimit, setTimeLimit] = useState<number>(5);
    const [mode, setMode] = useState<'NORMAL' | 'HARDCORE'>('NORMAL');
    const [questions, setQuestions] = useState([
        {
            text: '',
            alternatives: [
                { text: '', isCorrect: true },
                { text: '', isCorrect: false },
            ],
        },
    ]);

    const [loading, setLoading] = useState<boolean>(false);
    const [feedback, setFeedback] = useState<ResponseDTO | null>(null);

    // Gerenciamento dinâmico de perguntas
    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                text: '',
                alternatives: [
                    { text: '', isCorrect: true },
                    { text: '', isCorrect: false },
                ],
            },
        ]);
    };

    const removeQuestion = (qIndex: number) => {
        if (questions.length <= 1) return;
        setQuestions(questions.filter((_, idx) => idx !== qIndex));
    };

    const updateQuestionText = (qIndex: number, text: string) => {
        const updated = [...questions];
        updated[qIndex].text = text;
        setQuestions(updated);
    };

    // Gerenciamento de alternativas
    const addAlternative = (qIndex: number) => {
        const updated = [...questions];
        if (updated[qIndex].alternatives.length >= 5) return;
        updated[qIndex].alternatives.push({ text: '', isCorrect: false });
        setQuestions(updated);
    };

    const removeAlternative = (qIndex: number, aIndex: number) => {
        const updated = [...questions];
        if (updated[qIndex].alternatives.length <= 2) return;
        updated[qIndex].alternatives = updated[qIndex].alternatives.filter((_, idx) => idx !== aIndex);
        setQuestions(updated);
    };

    const updateAlternativeText = (qIndex: number, aIndex: number, text: string) => {
        const updated = [...questions];
        updated[qIndex].alternatives[aIndex].text = text;
        setQuestions(updated);
    };

    const setCorrectAlternative = (qIndex: number, aIndex: number) => {
        const updated = [...questions];
        updated[qIndex].alternatives = updated[qIndex].alternatives.map((alt, idx) => ({
            ...alt,
            isCorrect: idx === aIndex,
        }));
        setQuestions(updated);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFeedback(null);

        const roomData = {
            name,
            maxPlayers: Number(maxPlayers),
            timeLimit: Number(timeLimit),
            mode,
            questions,
        };


        const hasInvalidQuestion = questions.some(
            (q) => !q.text.trim() || q.alternatives.some((a) => !a.text.trim()) || !q.alternatives.some((a) => a.isCorrect)
        );

        if (hasInvalidQuestion) {
            setFeedback({
                type: 'Warning',
                message: 'Preencha o texto de todas as perguntas e alternativas e selecione a resposta correta.',
            });
            return;
        }

        setLoading(true);

        try {
            const { data } = await AXIOS.post<ResponseDTO>('/rooms', roomData);

            if (data.type === 'Success') {
                setFeedback({
                    type: 'Success',
                    message: data.message || 'Sala criada com sucesso! Redirecionando...',
                });

                setTimeout(() => {
                    navigate('/arena');
                }, 1500);
            } else {
                setFeedback({
                    type: 'Warning',
                    message: data.message || 'Não foi possível criar a sala.',
                });
            }
        } catch (error: any) {
            setFeedback({
                type: 'Warning',
                message: error.response?.data?.message || 'Erro de conexão ao criar a sala.',
            });
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
        setTimeLimit,
        mode,
        setMode,
        questions,
        addQuestion,
        removeQuestion,
        updateQuestionText,
        addAlternative,
        removeAlternative,
        updateAlternativeText,
        setCorrectAlternative,
        loading,
        feedback,
        handleSubmit,
    };
};