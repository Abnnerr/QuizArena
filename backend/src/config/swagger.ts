import swaggerJsdoc from "swagger-jsdoc";
import { answerDocs } from "../docs/answers.docs.js";
import { authDocs } from "../docs/auth.docs.js";
import { playerDocs } from "../docs/players.docs.js";
import { roomDocs } from "../docs/room.docs.js";
import { roundDocs } from "../docs/round.docs.js";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Quiz Arena API",
            version: "1.0.0",
            description: "Documentação da API do Quiz Arena"
        },
        servers: [
            {
                url: "http://localhost:9000/api",
                description: "Servidor de desenvolvimento"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        paths: {
            ...authDocs,
            ...roomDocs,
            ...playerDocs,
            ...answerDocs,
            ...roundDocs,
        }
    },
    apis: []
};

export const swaggerSpec = swaggerJsdoc(options);