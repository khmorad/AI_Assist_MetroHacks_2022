import './App.css';
import {useRef, useState} from "react";
import {RiseLoader} from "react-spinners";

function App() {

  const { Configuration, OpenAIApi } = require("openai");
  console.log("Test")
  

  const [essay, setEssay] = useState('');
  const textEl = useRef();
  const [image, setImage] = useState()
  const [disabled, setDisabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const API_KEY = process.env.REACT_APP_API_KEY
  console.log(API_KEY)
  const configuration = new Configuration({
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);


  const getAiEssay = async (prompt) => {
    setDisabled(true)
    setLoading(true)

    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: `Critique the writing:
       \n ${prompt} \n Critique:\n`,
      temperature: 0.7,
      max_tokens: 1200,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })

    const response2 = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: `Rewrite the following with better prose:
       \n ${prompt} \n Rewritten version:\n`,
      temperature: 0.7,
      max_tokens: 1200,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
    const data = await response.data.choices[0].text + '\n \n Revision: \n' + response2.data.choices[0].text
    console.log(data)
    setEssay(essay + '\n  \n Critique: \n' + data);
    setDisabled(false)
    setLoading(false)
  }

  const getImageRecognition = async (image) => {
    setEssay('')
    setLoading(true)
    const formData = new FormData();
    formData.append('image', image)
    const response = await fetch('https://api.api-ninjas.com/v1/imagetotext', {
      method: 'POST',
      headers: {
        "X-Api-Key": "YoFNYsMwuG2nAIgNj6baxw==sKw4bdnGnLWOawFm",
      },
      body: formData
    })
    const data = await response.json()
    console.log(data[0].text)
    const mod = data.map(item => item.text)
    setEssay(mod.join(' '))
    textEl.current.value = essay;
    console.log(mod)
    console.log(mod.join(' '))
    setLoading(false)
  }
  
  return (
    <div className="App">npm install react-scripts --save
      <div className="logo">
        <span>AI</span>Assist
      </div>
      <div className="container">

        <div className='intro'>
          Enter your Essay to receive a feedback by AI
        </div>
        
        <textarea className='container2'
          ref={textEl}
          value={essay}
          onChange={e => setEssay(e.target.value)}
        >
        </textarea>
        
        <div className='controls_container'>
          <button disabled={!essay || disabled} onClick={() => getAiEssay(essay)}>
            Submit
          </button>

          {loading ?
          <div className='loading_container'>
            <RiseLoader className="spinner" size={20} color='#7336d6'/>
            <p className='loading_text'>Please wait</p>
            <RiseLoader className="spinner" size={20} color='#7336d6'/>
          </div>

            : null}

          <label htmlFor="file-upload" className="custom-file-upload">
            Upload File
          </label>
          <input
            id='file-upload'
            type='file'
            name='file'
            onChange={e => getImageRecognition(e.target.files[0])}
            onClick={e => e.target.value = null}
          />


        </div>


      </div>
    </div>

  );
}

export default App;
