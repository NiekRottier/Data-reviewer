import { useEffect, useState } from 'react';
import './styles/App.scss';

import MoxyTA from 'moxy-ta';

function App() {
  const [uploadedFile, setUploadedFile] = useState()
  const [fileTxt, setFileTxt] = useState()
  const [isFileUploaded, setIsFileUploaded] = useState(false)

  const [TA, setTA] = useState()

  function handleChange(event) {
    console.log('Uploading file...')

    setUploadedFile(event.target.files[0]);
		setIsFileUploaded(true);
    console.log(event.target.files[0]);

    console.log('File has been uploaded.')
  }

  function readJsonFile() {
    if (isFileUploaded) {
      console.log('Reading the uploaded file...')

      const blob = new Blob([uploadedFile], {type:"application/json"});

      let reader = new FileReader()
      reader.addEventListener("load", () => {
        setFileTxt(reader.result)
      })

      reader.readAsText(blob)

      console.log('Put the JSON content into a State')
    } else {
      console.log('No file has been uploaded.')
    }
  }

  function textAnalysis(text) {
    console.log(typeof text)
    if (typeof text === 'string') {
      console.log('Analysing the text...')

      let ta = new MoxyTA(text)
      let result = ta.scan() 
      console.log(result)

      console.log('Text analysed.')

      return result
    }
  }

  useEffect(() => {
    if (fileTxt) {
      console.log(fileTxt)

      setTA(textAnalysis(fileTxt))
    }
  }, [fileTxt])

  return (
    <div className="App">
      <label htmlFor="file">Select a .json file</label>
      <input type="file" name="file" id="fileInput" accept='.json' onChange={handleChange} />
      <button id="upload" onClick={readJsonFile}>Analyse the uploaded file</button>
    </div>
  );
}

export default App;
