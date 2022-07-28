import { FunctionComponent, useCallback } from "react"
import AppBar from "./AppBar"
import ComposePopup from "./ComposePopup"
import ContentWindow from "./ContentWindow"
import { SetupJobs } from "./JobsContext"
import LeftPanel from "./LeftPanel"
import RightToolbar from "./RightToolbar"
import TopToolbar from "./TopToolbar"
import useVisibility from "./useVisibility"
import './MainLayout.css'
import ContentTitleBar from "./ContentTitleBar"

type Props = {
    width: number
    height : number
}

const appBarHeight = 64
const leftPanelWidth = 256
const rightToolbarWidth = 55
const topToolbarHeight = 48
const contentTitleBarHeight = 24

const colors = {
    appBar: 'lightgray',
    leftPanel: 'lightgray',
    rightToolbar: 'lightgray',
    topToolbar: 'lightgray',
    contentTitleBar: 'rgb(250, 250, 250)',
    contentWindow: '',
    composePopup: 'white'
}

const MainLayout: FunctionComponent<Props> = ({width, height}) => {
    const contentWindowWidth = width - leftPanelWidth - rightToolbarWidth
    const contentWindowHeight = height - appBarHeight - topToolbarHeight - contentTitleBarHeight
    const a = Math.min(contentWindowHeight - 300, contentWindowWidth - 300)
    const composePopupWidth = Math.min(Math.max(a, 400), 1000)
    const composePopupHeight = composePopupWidth
    const composePopupVisibility = useVisibility()
    const handleCreateNewJobBasedOnCurrent = useCallback(() => {
        composePopupVisibility.handleOpen()
    }, [composePopupVisibility])
    return (
        <SetupJobs>
            <div style={{width, height, position: "absolute"}}>
                <AppBar backgroundColor={colors.appBar} top={0} left={0} width={width} height={appBarHeight} />
                <LeftPanel onCompose={composePopupVisibility.handleOpen} backgroundColor={colors.leftPanel} top={appBarHeight} left={0} width={leftPanelWidth} height={height - appBarHeight} />
                <RightToolbar backgroundColor={colors.rightToolbar} top={appBarHeight} left={width - rightToolbarWidth} width={rightToolbarWidth} height={height - appBarHeight} />
                <TopToolbar backgroundColor={colors.topToolbar} top={appBarHeight} left={leftPanelWidth} width={width - leftPanelWidth - rightToolbarWidth} height={topToolbarHeight} onCreateNewJobBasedOnCurrent={handleCreateNewJobBasedOnCurrent} />
                <ContentTitleBar backgroundColor={colors.contentTitleBar} top={appBarHeight + topToolbarHeight} left={leftPanelWidth} width={width - leftPanelWidth - rightToolbarWidth} height={contentTitleBarHeight} />
                <ContentWindow backgroundColor={colors.contentWindow} top={appBarHeight + topToolbarHeight + contentTitleBarHeight} left={leftPanelWidth} width={contentWindowWidth} height={contentWindowHeight} />
                {
                    composePopupVisibility.visible && (
                        <ComposePopup
                            onClose={composePopupVisibility.handleClose}
                            backgroundColor={colors.composePopup}
                            top={height - composePopupHeight - 15}
                            left={width - rightToolbarWidth - composePopupWidth - 15}
                            width={composePopupWidth}
                            height={composePopupHeight}
                        />
                    )
                }
            </div>
        </SetupJobs>
    )
}

export default MainLayout