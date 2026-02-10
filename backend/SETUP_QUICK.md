# Quick Setup - Qatar 2030 Chatbot

## 1. Start Ollama (must run first!)

```bash
ollama serve
```
Keep this running in a separate terminal. Or start the Ollama app if installed.

## 2. Pull the chat model

```bash
ollama pull llama3.2:3b
```
(This model is faster than Mistral for CPU. For Mistral: `ollama pull mistral`)

## 3. Build RAG index (one time)

```bash
cd backend
python build_index.py
```

## 4. Start backend

```bash
python run.py
```

## 5. Start frontend

```bash
cd frontend
npm run dev
```

## Troubleshooting

**"AI is thinking" forever?**
- Is Ollama running? (`ollama list` should work)
- Is the model pulled? (`ollama pull llama3.2:3b`)
- Check backend terminal for logs: "Chat request received" → "Building RAG context" → "Ollama response received"

**Slow responses?**
- Use `llama3.2:3b` (faster) instead of `mistral` in config.py
- Or try `phi3:mini` for even faster replies
