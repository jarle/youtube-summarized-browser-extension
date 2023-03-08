import React, { FC, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { SummaryContext } from "../common/state";
import { SpinningLoader } from "./spinningLoader";

export const SummaryPanel: FC<{ onPanelClose: () => void }> = ({ onPanelClose }) => {
    const [summaryActor, updateSummaryActor] = SummaryContext.useActor()

    const { summary, videoId } = summaryActor.context
    const triggerSummary = () => {
        updateSummaryActor({
            type: "Summarize",
            videoURL: window.location.href
        })
    }

    useEffect(() => {
        addEventListener('ytSummarizedTriggerSummary', triggerSummary)
        return () => {
            removeEventListener('ytSummarizedTriggerSummary', triggerSummary)
        }
    }, [])

    return (
        <React.StrictMode>
            <>
                <div className="yt-summarized">
                    {
                        <div id="summary-container" className={`container style-scope ytd-watch-flexy`}>
                            <div>
                                <button
                                    className="yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-only-default"
                                    onClick={() => onPanelClose()}>
                                    X
                                </button>
                            </div>
                            {
                                summaryActor.matches("loading") ? <div>
                                    Loading summary
                                    <SpinningLoader />
                                </div> : null
                            }
                            {
                                summary ?
                                    <>
                                        <a href={`https://youtubesummarized.com/v/${videoId}`} target="_blank">Read on youtubesummarized.com</a>
                                        <ReactMarkdown
                                            children={summary.replace(/https:\/\/www.youtube.com/g, "")}
                                            skipHtml
                                        />
                                    </> : null
                            }
                            {
                                summaryActor.matches("failed") ?
                                    <div>{summaryActor.context.errorMessage}</div> : null
                            }
                        </div>
                    }
                </div>
            </>
        </React.StrictMode>
    );
}