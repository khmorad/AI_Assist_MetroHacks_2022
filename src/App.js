import './App.css';
import {useRef, useState} from "react";
import {BarLoader} from "react-spinners";
import Navbar from './Navbar';
import './scrollbar.css';
import Critique from './Critique.js';
import Revision from './Rivision';
import axios from 'axios';

import './backGround.css'
function App() {

  const { Configuration, OpenAIApi } = require("openai");
  
  

  const [essay, setEssay] = useState('');
  const [critique, setCritique] = useState('');
  const [revision, setRevision] = useState('');
  const textEl = useRef();
  const [image, setImage] = useState()
  const [disabled, setDisabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const API_KEY = process.env.REACT_APP_API_KEY
  const API_KEY_2 = process.env.REACT_APP_API_KEY_2;

  const configuration = new Configuration({
    apiKey: API_KEY,
  });
  const openai = new OpenAIApi(configuration);


  const getAiEssay = async (prompt) => {
    setDisabled(true);
    setLoading(true);
  
    try {
      const critiqueResponse = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: `Critique the writing:\n${prompt}\nCritique:\n`,
        temperature: 0.7,
        max_tokens: 1200,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
  
      const revisionResponse = await openai.createCompletion({
        model: "davinci-002",
        prompt: `Rewrite the following with better prose:\n${prompt}\nRewritten version:\n`,
        temperature: 0.7,
        max_tokens: 1200,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
  
      const critiqueText = critiqueResponse.data.choices[0].text;
      const revisionText = revisionResponse.data.choices[0].text;
  
      setCritique(critiqueText);
      setRevision(revisionText);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  
    setDisabled(false);
    setLoading(false);
  }
  

  const getImageRecognition = async (image) => {
    setEssay('')
    setLoading(true)
    const formData = new FormData();
    formData.append('image', image)
    const response = await fetch('https://api.api-ninjas.com/v1/imagetotext', {
      method: 'POST',
      headers: {
        "X-Api-Key": API_KEY_2,
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
    <div class="">
    <div className="containerAll">
      
      <Navbar />
      <div className="App">
        <div className="container">
          <div className='intro'>
          </div>
  
          <textarea className='container2' placeholder='Enter your Essay to receive a feedback by AI'
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
                <BarLoader className="spinner" size={20} color='#91F918' />
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
  
      <div className="side-panel">
        <Critique critique={critique} />
        <Revision revision={revision} />
      </div>
      
    </div>
    </div>
  );
}

export default App;