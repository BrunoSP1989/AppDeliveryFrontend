import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    // Ajuste a porta/URL para a sua API real
                    const res = await fetch("http://localhost:3000/login", {
                        method: 'POST',
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password
                        }),
                        headers: { "Content-Type": "application/json" }
                    });

                    const data = await res.json();

                    // Verifica se a API retornou o token conforme o seu JSON
                    if (res.ok && data.token) {
                        return {
                            id: data.store.id,
                            email: data.store.email,
                            role: data.store.role,
                            token: data.token,
                            refreshToken: data.refreshToken
                        };
                    }

                    return null;
                } catch (error) {
                    console.error("Erro no login:", error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            // O objeto 'user' tem os dados retornados no authorize (apenas no momento do login)
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.accessToken = user.token;
                token.refreshToken = user.refreshToken;
            }
            return token;
        },
        async session({ session, token }) {
            // Repassa as informações essenciais para a sessão do cliente e rotas de API
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            session.accessToken = token.accessToken;

            return session;
        }
    },
    pages: {
        signIn: '/login',
    }
});

export { handler as GET, handler as POST };