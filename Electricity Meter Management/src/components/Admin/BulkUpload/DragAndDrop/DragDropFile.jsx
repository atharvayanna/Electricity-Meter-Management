import { use, useState } from 'react'
import './DragDropFile.css'

const DragDropFile = () => {
    const [file,setFile] = useState(null);
  return (
    <>
    {!file && (
        <div className="drag_drop">
            
        </div>
    )
    }
    </>
  )
}

export default DragDropFile