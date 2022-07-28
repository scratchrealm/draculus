import { Button, Table, TableBody, TableCell, TableRow } from "@material-ui/core"
import { Edit, Folder } from "@material-ui/icons"
import { FunctionComponent } from "react"
import { useJobs } from "./JobsContext"

type Props = {
    onCompose: () => void
    left: number
    top: number
    width: number
    height: number
    backgroundColor: string
}

const LeftPanel: FunctionComponent<Props> = ({onCompose, left, top, width, height, backgroundColor}) => {
    const {folders, setCurrentFolder, currentFolder, setCurrentJob} = useJobs()
    return (
        <div style={{left, top, width, height, position: "absolute", backgroundColor, borderTop: 'solid 1px gray'}}>
            <div style={{paddingLeft: 10, paddingTop: 10}}>
                <Button variant="contained" onClick={onCompose}><Edit />&nbsp;&nbsp;Create job</Button>
            </div>
            <div style={{paddingLeft: 10, paddingTop: 20}}>
                <Table className="Table2">
                    <TableBody>
                        {
                            folders.map(folder => {
                                const rowColor = (folder || 'Default') === (currentFolder || 'Default') ? 'rgb(240, 220, 200)' : undefined
                                return (
                                    <TableRow key={folder} style={{cursor: 'pointer', background: rowColor}} onClick={() => {setCurrentFolder(folder); setCurrentJob(undefined);}}>
                                        <TableCell style={{width: 20}}></TableCell>
                                        <TableCell style={{width: 20}}><FolderIcon folder={folder} /></TableCell>
                                        <TableCell style={{width: 150}}>{folder}</TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

const FolderIcon: FunctionComponent<{folder: string}> = ({folder}) => {
    return <Folder />
}

export default LeftPanel