export function useLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (!username.trim() || !password.trim()) {
            setErrorMsg('Por favor, preencha todos os campos!');
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setSuccessMsg(`Bem-vindo(a) ao jogo, ${username}!`);
        }, 1200);
    };
    return {
        username,
        setUsername,
        password,
        setPassword,
        isLoading,
        setIsLoading,
        errorMsg,
        setErrorMsg,
        successMsg,
        setSuccessMsg,

        handleSubmit
    }
}