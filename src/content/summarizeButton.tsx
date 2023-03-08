import logo from 'data-base64:~assets/outline-logo.svg'
import type { FC } from "react"

type props = {
    onClick: () => void
}

export const SummarizeButton: FC<props> = ({ onClick }) => {
    return (
        <div id="summary-button" className="yt-summarized">
            <button
                className="yt-spec-button-shape-next yt-spec-button-shape-next--filled yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m "
                onClick={onClick}
            >
                <div style={{ display: "flex", flexDirection: "column", marginRight: "4px" }}>
                    <img
                        src={chrome.runtime.getURL(logo)}
                        height="32px"
                        width="32px"
                        className="style-scope yt-icon"
                    ></img>
                </div>
                Summarize
            </button>
        </div>
    )
}