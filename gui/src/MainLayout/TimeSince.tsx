import { FunctionComponent, useEffect, useState } from "react";

type Props = {
    timestamp: number
}

const TimeSince: FunctionComponent<Props> = ({timestamp}) => {
    const [text, setText] = useState<string>(timeSince(timestamp))
    useEffect(() => {
        let cancel = false
        function update() {
            if (cancel) return
            setTimeout(() => {
                setText(timeSince(timestamp))
                update()
            }, 30 * 1000)
        }
        update()
        return () => {cancel = true}
    }, [timestamp])
    return (
        <span>{text}</span>
    )
}

// thanks https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
export const timeSince = (date: number) => {
    var seconds = Math.floor((Date.now() - date) / 1000);

    var interval = seconds / 31536000;

    function theDate() {
        return new Date(date).toLocaleDateString('en-US')
    }

    if (interval > 1) {
        return theDate()
        // return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return theDate()
        // return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return theDate()
        // return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hrs ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " min ago";
    }
    return Math.floor(seconds) + " sec ago";
}

export default TimeSince