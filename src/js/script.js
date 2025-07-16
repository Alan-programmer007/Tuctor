const apiKeyInput = document.getElementById('apiKey')
const liguangemSelect = document.getElementById('linguagem')
const textPergunta = document.getElementById('textareaPergunta')
const askButton = document.getElementById('askButton')
const iaResponse = document.getElementById('iaResponse')
const formulario = document.getElementById('formulario')

const markdownToHTML = (text) => {
    const converter = new showdown.Converter()
    return converter.makeHtml(text)
}

const perguntarAI = async(question, linguagem, apiKey) => {
    const model = "gemini-2.5-flash"
    const baseURL =  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
    const pergunta = `
        ## Especialidade
        Você é um professor e especialista em programação com foco na linguagem ${linguagem}.  
        Seu papel é ensinar e explicar o usuário sobre essa linguagem da forma mais objetiva e resumida.

        ## Tarefa
        Responda as perguntas do usuário com base em seu conhecimento técnico sobre a linguagem de programação especificada, fornecendo exemplos de código sempre que necessário.

        ## Regras
        - Se você não souber a resposta, diga apenas "Não sei" e **não tente inventar**.
        - Se a pergunta não estiver relacionada à linguagem ${linguagem}, diga: "Essa pergunta não está relacionada à linguagem em questão."
        - Considere a data atual: ${new Date().toLocaleDateString}
        - Baseie suas respostas nas principais atualizações e convenções mais recentes.
        - Nunca mencione ou explique recursos que você não tenha certeza de que existem atualmente na linguagem.

        ## Formato da Resposta
        - Seja direto e objetivo.
        - Responda com no máximo **700 caracteres**.
        - Use **Markdown** para formatar códigos e trechos técnicos.
        - Sempre que possível, **inclua um pequeno exemplo funcional** de código.
        - **Não cumprimente nem se despeça**. Responda apenas ao que foi perguntado.

        ## Exemplo de resposta
        Pergunta do usuário: Como fazer um Hello World em Java?

        Resposta:
        \`\`\`java
        public class HelloWorld {
            public static void main(String[] args) {
                System.out.println("Hello, World!");
            }
        }
        \`\`\`

        ---

        Aqui está a pergunta do usuário: ${question}
        `

    const contents = [{
        role: "user",
        parts: [{
            text: pergunta
        }]
    }]

    const tools = [{
        google_search: {}
    }]

    const reponse = await fetch(baseURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents,
            tools
        })
    })

    const data = await reponse.json()
    return data.candidates[0].content.parts[0].text
}

const enviarFormulario = async(event) => {
    event.preventDefault()
    const apiKey = apiKeyInput.value
    const linguagem = liguangemSelect.value
    const question = textPergunta.value

    if(apiKey == '' || linguagem == '' || question == ''){
        alert('Por favor, preencha todos os campos!')
        return
    }

    askButton.disabled = true
    askButton.textContent = 'Perguntando...'
    askButton.classList.add('loading')

    try{
        const text = await perguntarAI(question, linguagem, apiKey)
        iaResponse.querySelector('.reponse-content').innerHTML = markdownToHTML(text)
        iaResponse.classList.remove('hidden')
    } catch(error) {
        console.log("Error ", error)
    } finally {
        askButton.disabled = false
        askButton.textContent = 'Perguntar'
        askButton.classList.remove('loading')
    }
}

formulario.addEventListener('submit', enviarFormulario)