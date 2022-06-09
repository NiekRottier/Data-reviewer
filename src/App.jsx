import { useEffect, useState } from 'react';
import './styles/App.scss';

function App() {
  const [uploadedFile, setUploadedFile] = useState()
  const [fileJson, setFileJson] = useState()
  const [isFileUploaded, setIsFileUploaded] = useState(false)

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
        setFileJson(JSON.parse(reader.result))
      })

      reader.readAsText(blob)

      console.log('Put the JSON content into a State')
    } else {
      console.log('No file has been uploaded.')
    }
  }

  useEffect(() => {
    console.log(fileJson);
  }, [fileJson])

  return (
    <div className="App">
      <label htmlFor="file">Select a .json file</label>
      <input type="file" name="file" id="fileInput" accept='.json' onChange={handleChange} />
      <button id="upload" onClick={readJsonFile}>Read the uploaded file</button>
    </div>
  );
}

export default App;
