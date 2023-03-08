import { Button, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { supabase } from "~src/common/store";

export function Login() {
    const [user, setUser] = useState<string>()

    const setUserEmail = async () => {
        const hasSession = await supabase.auth.getSession()
        if (hasSession.data.session) {
            await supabase.auth.getUser()
                .then(res => {
                    setUser(res.data.user?.email)
                })
        }
    }

    useEffect(() => {
        setUserEmail()
    }, [])

    const handleLogin = async () => {
        const url = new URL(window.location.href)
        const redirectTo = `${url.protocol}//${url.host}${url.pathname}`
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo }
        })
        if (error) {
            console.error(error)
        }
    }
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            console.error(error)
        }
        setUser(undefined)
    }

    return (
        <VStack>
            {
                user ?
                    <Button onClick={handleLogout}>{`Log out ${user}`}</Button> :
                    <Button onClick={handleLogin}>Log in</Button>
            }
        </VStack>
    )
}