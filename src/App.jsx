import { useCallback, useMemo, useState } from 'react';
import './App.css';
import OpenAI from "openai";

function App() {
  // console.log(import.meta.env.VITE_APIKEY);
  const openai = useMemo(() => new OpenAI({ apiKey: import.meta.env.VITE_APIKEY, dangerouslyAllowBrowser: true }), [])
  const [prompt, setPrompt] = useState('');

  const results = useCallback(async (prompt) => {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    const response = await openai.images.generate({
      model: "dall-e-2",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    console.log(response.data);
    let image_url = response.data[0].url;

    let results = document.getElementById('results');
    let question = document.createElement('h3');
    question.innerHTML = prompt;
    let elem = document.createElement('p');
    elem.innerText = completion.choices[0].message.content;
    let img = document.createElement('img');
    img.src = image_url;
    img.alt = "img";
    results.append(question);
    results.append(img);
    results.append(elem);

  }, [openai]);

  const handleClick = (e) => {
    e.preventDefault();
    results(prompt);
    setPrompt("");
  }
  return (
    <>
      <form>
        <div className="mb-3">
          <label htmlFor="message" className="form-label">Enter Your Prompt</label>
          <input type="text" className="form-control" id="message" aria-describedby="message" placeholder='write something to search...' onChange={(e) => { setPrompt(e.target.value) }} value={prompt} />
        </div>
        <button type="submit" className="btn btn-primary" onClick={handleClick}>Submit</button>
      </form>
      <div id="results"></div>
    </>
  )
}

export default App
