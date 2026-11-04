export const COLORS = {
    background: {
        main: "#121212",        // Fundo principal da página (<main>)
        card: "#1E1E1E",        // Cards, modais e containers elevados
        input: "#151515",       // Fundo de inputs e campos de texto
        inputFocus: "#1A1A1A",  // Fundo de inputs em foco
        hover: "#282828",       // Estados de hover em botões secundários
    },
    // Bordas e Linhas
    border: {
        primary: "#2A2A2A",     // Bordas padrão dos cards e inputs
        secondary: "#333333",   // Bordas secundárias / itens desativados
        light: "#3A3A3A",       // Bordas mais claras para elementos interativos
    },

    // Textos e Tipografia
    text: {
        primary: "#F3F4F6",     // Texto principal (branco suave)
        secondary: "#AAAAAA",   // Subtítulos e descrições
        muted: "#888888",       // Rótulos (labels), contadores e textos auxiliares
        disabled: "#666666",    // Elementos desativados
        placeholder: "#444444", // Placeholders dos inputs
    },
    // Cores de Destaque / Gamificação
    brand: {
        yellow: "#FFC800",      // Amarelo primário (Timer, ícones, badges)
        yellowText: "#7A5B00",  // Texto para botões amarelos
        yellowBorder: "#C69B00",// Borda 3D amarela

        green: "#58CC02",       // Verde principal (Confirmar, Sucesso, Criar Conta)
        greenHover: "#61E002",  // Hover do verde
        greenBorder: "#46A302", // Borda 3D verde

        blue: "#1CB0F6",        // Azul principal (Links, Skip Turn, Foco, Ações)
        blueHover: "#00A2ED",   // Hover do azul
        blueBorder: "#0092D6",  // Borda 3D azul

        red: "#FF4B4B",         // Vermelho (Erros, Alertas, Crítico)
        redBackground: "#3B1515",// Fundo de alerta vermelho suave
    },
    // Alternativas da Partida (Quiz Alternatives)
    alternatives: [
        {
            id: "triangle",
            bg: "#E21B3C",
            border: "#9E1328",
        },
        {
            id: "diamond",
            bg: "#1368CE",
            border: "#0B3E7A",
        },
        {
            id: "circle",
            bg: "#D89E00",
            border: "#805E00",
        },
        {
            id: "square",
            bg: "#26890C",
            border: "#174F07",
        },
    ],
};