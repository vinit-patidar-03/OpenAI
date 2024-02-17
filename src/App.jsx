import { useCallback, useMemo, useState } from 'react';
import './App.css';
import OpenAI from "openai";
import Loader from './components/Loader';
import NothingToShow from './components/NothingToShow';

function App() {
  const openai = useMemo(() => new OpenAI({ apiKey: import.meta.env.VITE_APIKEY, dangerouslyAllowBrowser: true }), [])
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  const results = useCallback(async (prompt) => {
    setLoading(true);
    setCount((prev) => prev + 1);
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    const response = await openai.images.generate({
      model: "dall-e-2",
      prompt: prompt,
      n: 1,
      size: "256x256",
    });
    let image_url = response.data[0].url;
    setLoading(false);

    let results = document.getElementById('results');
    let div = document.createElement('div');
    let question = document.createElement('h3');
    question.innerHTML = prompt;

    let elem = document.createElement('p');
    elem.innerText = completion.choices[0].message.content;

    let img = document.createElement('img');
    img.src = image_url;
    img.alt = "img";

    elem.classList.add('p-3', 'anta-regular');
    img.classList.add('m-auto', 'd-block', 'mt-3');
    question.classList.add('text-center', 'anta-regular');
    div.classList.add('p-2');

    div.append(question);
    div.append(img);
    div.append(elem);
    div.classList.add('mt-2', 'bg-light', 'shadow-sm')

    results.appendChild(div);

  }, [openai]);

  const handleClick = (e) => {
    e.preventDefault();
    results(prompt);
    setPrompt("");
  }
  return (
    <>
      <h1 className='text-center anta-regular bg-light p-3'>Chatgpt2.0</h1>
      <form className='d-flex justify-content-center flex-column m-auto mt-5 w-75'>
        <div className="mb-3">
          <label htmlFor="message" className="form-label fw-bold">Enter Your Prompt</label>
          <input type="text" className="form-control" id="message" aria-describedby="message" placeholder='write prompt here...' onChange={(e) => { setPrompt(e.target.value) }} value={prompt} />
        </div>
        <button type="submit" className="btn btn-primary" onClick={handleClick}>Submit</button>
      </form>
      <div className='w-100 mt-5'>
        <div id="results" className='w-75 m-auto'></div>
      </div>
      {loading && <Loader />}
      {count === 0 && <NothingToShow />}
    </>
  )
}

export default App
