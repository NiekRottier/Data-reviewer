import { useEffect, useState } from 'react';
import './styles/App.scss';

import MoxyTA from 'moxy-ta';
import { TagCloud } from 'react-tagcloud'

function App() {
  const [uploadedFile, setUploadedFile] = useState()
  const [isFileUploaded, setIsFileUploaded] = useState(false)

  const [fileJson, setFileJson] = useState()
  const [jsonValues, setJsonValues] = useState([])

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
        setFileJson(JSON.parse(reader.result))
      })

      reader.readAsText(blob)

      console.log('Put the JSON content into a State')
    } else {
      console.log('No file has been uploaded.')
    }
  }

  function textAnalysis(text) {
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

  function extractJsonValues(json, values = [], i = 0) {
    // console.log('iteration: '+i)

    // All the found values
    // console.log(values)

    // What it will loop through next
    // console.log(json)

    // Get the next values to loop through
    let newValues = Object.values(json)
    // console.log(newValues);

    let finalLoop = true

    newValues.forEach(datapoint => {                        // For each datapoint in the array... 
      if (typeof datapoint === 'object'){                   // ...check if it is an object.
        finalLoop = false
        return extractJsonValues(datapoint, values, i++)    // Loop through the next object
      } else {                                              // If it isn't an object
        values.push(datapoint)                              // Save the value in the values array
      }
    })

    if (finalLoop) {
      // console.log('Json values extracted.');
      // console.log(values);

      // Array to String
      setJsonValues(values.join(" "))
    }
  }

  // Set the Json values when the file updates
  useEffect(() => {
    if (fileJson) {
      console.log(fileJson)

      console.log('Extracting json values...');
      extractJsonValues(fileJson)
    }
  }, [fileJson])

  // Analyse the values when they update
  useEffect(() => {
    if (jsonValues) {
      console.log(jsonValues)
      
      setTA(textAnalysis(jsonValues))
    }
  }, [jsonValues])

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
