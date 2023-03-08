import { Storage } from "@plasmohq/storage"

const storage = new Storage()

export const getToken = async (): Promise<string | null> => {
    return await storage.get("openapi-token")
}

export const storeToken = async (token: string) => {
    await storage.set("openapi-token", token)
}