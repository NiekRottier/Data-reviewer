import { useEffect, useState } from 'react';
import './styles/App.scss';

import MoxyTA from 'moxy-ta';
import { TagCloud } from 'react-tagcloud'
// import { analyze } from 'text-analysis'

function App() {
  const [uploadedFile, setUploadedFile] = useState()
  const [isFileUploaded, setIsFileUploaded] = useState(false)

  const [fileJson, setFileJson] = useState()
  const [jsonValues, setJsonValues] = useState([])

  const [TA, setTA] = useState()
  const [duplicateURLs, setDuplicateURLs] = useState({})
  const [TagCloudHTML, setTagCloudHTML] = useState(<p>Please analyse the file to see the wordcloud</p>)
  const [topURLs, setTopURLs] = useState(<p>Please analyse the file to see the top URLs</p>)

  function handleChange(event) {
    setUploadedFile(event.target.files[0]);
		setIsFileUploaded(true);

    console.log('File has been uploaded.')
  }

  // Check if an object is empty
  function isEmptyObject(obj) {
    if (obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype) {
        return true
    } else {
        return false
    }
}

  // Get the content from the file and put it in the FileJson state
  function readJsonFile() {
    if (isFileUploaded) {
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

  // Return the analysis (word/letter frequency) of the given text 
  function textAnalysis(text) {
    if (typeof text === 'string') {
      let ta = new MoxyTA(text)
      let result = ta.scan() 

      console.log('Text analysed.')

      return result
    }
  }

  // Sets DuplicateStrings state to an object with the duplicated strings with a frequency count
  function findDuplicateURLs(array) {
    const counts = {}

    for (const num of array) {
      // If the value is a string and a URL
      if (typeof num === 'string' && num.startsWith('http')) {
        
        // Get the host out of the URL
        let host = num.split( '/' )[2]

        // Check if the host is a duplicate
        counts[host] = counts[host] ? counts[host] + 1 : 1
      }
    }

    setDuplicateURLs(counts)
  }
  
  // Put the top words in the TagCloud
  function createTagCloud(textData) {
    let tags = []

    // Put the 20 most popular words in the correct syntax for the wordcloud and calculate how many times the word appears
    textData.topWords.forEach(word => {
      tags.push({ value: word.word, count: word.frequency*textData.totals.totalWords })
    });

    setTagCloudHTML(<TagCloud key={0} minSize={20} maxSize={100} tags={tags} />)
  }

  // Extract all the Json values and put an array of them in the JsonValues state
  function extractJsonValues(json, values = [], i = 0) {
    // Get the next values to loop through
    let newValues = Object.values(json)

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
      setJsonValues(values)
    }
  }

  // Read the Json file when it is uploaded 
  useEffect(() => {
    if (isFileUploaded) {
      readJsonFile()
    }
  }, [isFileUploaded])

  // Set the Json values when the file updates
  useEffect(() => {
    if (fileJson) {
      extractJsonValues(fileJson)
      console.log('Extracted JSON values...');
    }
  }, [fileJson])

  // Analyse the values when they update
  useEffect(() => {
    if (jsonValues) {
      findDuplicateURLs(jsonValues)

      if (jsonValues.length > 0) {
        setTA(textAnalysis(jsonValues.join(" ")))
      }
    }
  }, [jsonValues])

  // Fill topURLs when the duplicateStrings is updated 
  useEffect(() => {
    // Check if duplicateStrings is filled 
    if (!isEmptyObject(duplicateURLs)) {
      // Sort all the URLs based on their value (how many times they where opened)
      let sortedList = Object.entries(duplicateURLs).sort((a,b) => b[1]-a[1])

      let newTopURLs = []
      // Put the top 20 most visited URLs in newTopURLs
      for (let i = 0; i < 20; i++) {
        let newItem = <p key={i}>{sortedList[i][0]} <br /> {sortedList[i][1]} times</p>
        newTopURLs.push(newItem)
      }

      setTopURLs(newTopURLs)
    }
  }, [duplicateURLs])

  // Create a new Tag Cloud if the Text Analysis updates
  useEffect(() => {
    if (TA) {
      createTagCloud(TA)
    }
  }, [TA])

  return (
    <div className="App">
      <header>
        <h1>The Data Reviewer</h1>
        <label htmlFor="fileInput">Upload a JSON-file</label>
        <input type="file" id="fileInput" accept='.json' onChange={handleChange} />
      </header>

      { TagCloudHTML }
      { topURLs }
    </div>
  );
}

export default App;
