import { Summary } from "../types";
import { APIUserInfo } from './../types';

const API_GATEWAY_URL = "https://api.youtubesummarized.com"

export async function getUserInfo(token: string): Promise<APIUserInfo> {
    return fetch(
        `${API_GATEWAY_URL}/v1/user/info`,
        {
            headers: {
                "openai-token": token,
                "yt-summarized-request-source": "BROWSER_EXTENSION",
                "Access-Control-Allow-Origin": API_GATEWAY_URL
            }
        }
    )
        .then(
            async res => {
                const response = await res.json()
                if (res.status == 200) {
                    return response
                }
                throw Error(`${response.message}`)
            }
        )
        .catch(
            error => {
                console.error(error)
                throw (error)
            }
        )
}

export async function getSummary(token: string, videoURL: string): Promise<Summary> {
    return fetch(
        `${API_GATEWAY_URL}/v1/youtube/summarizeVideoWithToken?videoURL=${videoURL}`,
        {
            headers: {
                "openai-token": token,
                "yt-summarized-request-source": "BROWSER_EXTENSION",
                "Access-Control-Allow-Origin": API_GATEWAY_URL
            }
        }
    )
        .then(
            async res => {
                const response = await res.json()
                if (res.status == 200) {
                    return response
                }
                throw Error(`${response.message}`)
            }
        )
        .catch(
            error => {
                console.error(error)
                throw (error)
            }
        )
}