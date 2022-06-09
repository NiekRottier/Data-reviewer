import { useEffect, useState } from 'react';
import './styles/App.scss';

import MoxyTA from 'moxy-ta';
import { TagCloud } from 'react-tagcloud'

function App() {
  const [uploadedFile, setUploadedFile] = useState()
  const [fileTxt, setFileTxt] = useState()
  const [isFileUploaded, setIsFileUploaded] = useState(false)

  const [TA, setTA] = useState()
  const [TagCloudHTML, setTagCloudHTML] = useState(<p>Please analyse the file to see the wordcloud</p>)

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

  function createTagCloud(textData) {
    let tags = []

    // Put the 20 most popular words in the correct syntax for the wordcloud and calculate how many times the word appears
    textData.topWords.forEach(word => {
      tags.push({ value: word.word, count: word.frequency*textData.totals.totalWords })
    });

    console.log(tags);

    setTagCloudHTML(<TagCloud key={0} minSize={20} maxSize={100} tags={tags} />)
  }

  // Analyse the text when it updates
  useEffect(() => {
    if (fileTxt) {
      console.log(fileTxt)

      setTA(textAnalysis(fileTxt))
    }
  }, [fileTxt])

  // Create a new Tag Cloud if the Text Analysis updates
  useEffect(() => {
    if (TA) {
      console.log(TA)

      createTagCloud(TA)
    }
  }, [TA])

  return (
    <div className="App">
      <label htmlFor="file">Select a .json file</label>
      <input type="file" name="file" id="fileInput" accept='.json' onChange={handleChange} />
      <button id="upload" onClick={readJsonFile}>Analyse the uploaded file</button>

      { TagCloudHTML }
    </div>
  );
}

export default App;
