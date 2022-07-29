import { FunctionComponent, useCallback } from "react"
import draculusLogo from '../draculus.png'
import { useJobs } from "./JobsContext"
import SearchBar from "./SearchBar"

type Props = {
    left: number
    top: number
    width: number
    height: number
    backgroundColor: string
}

const AppBar: FunctionComponent<Props> = ({left, top, width, height, backgroundColor}) => {
    const {setCurrentJob, setCurrentFolder, setJobSearchString} = useJobs()
    const handleHome = useCallback(() => {
        setCurrentJob(undefined)
        setCurrentFolder(undefined)
    }, [setCurrentFolder, setCurrentJob])
    const searchBarWidth = 300
    return (
        <div style={{left, top, width, height, position: "absolute", backgroundColor}}>
            <div>
                <img onClick={handleHome} src={draculusLogo} alt="draculus" height="40px" style={{paddingTop: 12, paddingLeft: 20, cursor: 'pointer'}} />
            </div>
            <div style={{left: left + 256, top, width: searchBarWidth, height, position: 'absolute'}}>
                <SearchBar
                    setSearchString={setJobSearchString}
                    width={searchBarWidth}
                    height={height}
                />
            </div>
        </div>
    )
}

export default AppBar