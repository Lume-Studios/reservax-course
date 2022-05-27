import axios from 'axios'

const submitEmailButton = document.querySelector('.submit-email')
const inputEmail = document.querySelector('.input-email')
const loadingWrapper = document.querySelector('.loading-wrapper')
const errorWrapper = document.querySelector('.error-wrapper')
const errorMessage = document.querySelector('.error-message')
const loadingWallet = document.querySelector('.animation-text')
const textAvailableLicenses = document.querySelector('.text-available-licenses')
const emailForm = document.querySelector('.email-form')
const tokenQtd = document.querySelector('.token_qtd')
const formBlock = document.querySelector('.form_block')
const sucessClaim = document.querySelector('.sucess-claim')
const licensesInfo = document.querySelector('.licenses-info')
inputEmail.style.color = 'white'

let address = 0

const submitEmail = async () => {
    const response = await getSubmitEmail()
    if (response) {
        window.location.assign('/sucesso-curso')
    }
}

const createForm = (email = '') => {
    const form = document.createElement('form')
    form.style.display = 'flex'
    form.style.width = '100%'
    const input = document.createElement('input')
    input.classList.add('text-field-2')
    input.classList.add('input-email')
    input.classList.add('w-input')
    input.placeholder = 'SEUNOME@EMAIL.COM'
    input.style.backgroundColor = '#C9C9C9'
    input.style.color = '#303030'
    input.value = email
    input.style.color = 'white'
    if (input.value !== '') {
        input.readOnly = true
        input.style.backgroundColor = '#555'
    }
    const button = document.createElement('button')
    button.classList.add('button')
    button.classList.add('submit-email')
    button.classList.add('w-button')
    button.innerText = 'RESGATAR'
    button.type = 'button'
    button.style.alignSelf = 'center'
    if (input.value !== '') {
        button.classList.add('is-disabled')
        button.innerText = 'RESGATADO'
    }
    if (input.value === '') {
        button.addEventListener('click', function () {
            getSubmitEmail(input.value, button, input)
        })
    }
    form.appendChild(input)
    form.appendChild(button)
    formBlock.appendChild(form)
}

const addForm = (possibleClaims, usedEmails, usedClaims) => {
    usedEmails.map(email => {
        createForm(email)
    });
    [...Array(possibleClaims - usedClaims)].map(qtd => createForm())

}

const setLoading = () => {
    loadingWrapper.classList.remove('is-hidden')
    submitEmailButton.classList.add('is-hidden')
    errorWrapper.classList.remove('active-error')
    errorWrapper.classList.add('is-hidden')
}

const setError = (message) => {
    loadingWrapper.classList.add('is-hidden')
    errorMessage.innerText = message
    errorWrapper.classList.remove('is-hidden')
    errorWrapper.classList.add('active-error')
}

const prepareError = () => {
    errorWrapper.classList.remove('active-error')
    errorWrapper.classList.add('is-hidden')
}

const isHolder = async () => {
    try {
        const accounts = await window.ethereum.request({
            method: "eth_accounts",
        });
        console.log(accounts[0])
        address = accounts[0]

        if (accounts.length > 0) {
            const token = localStorage.getItem('ACCESS_TOKEN')
            if (token) {
                axios.defaults.headers.common.authentication = token
                const response = await axios.get(process.env.SERVER + `users/info?projectId=${process.env.PROJECT_ID}`, {
                })
                submitEmailButton.classList.remove('is-disabled')
                loadingWallet.classList.add('is-hidden')
                textAvailableLicenses.classList.remove('is-hidden')
                return response
            } else {
                delete axios.defaults.headers.common.authentication
                window.location.assign('/area-do-cliente')
            }
        } else {
            window.location.assign('/area-do-cliente')
        }
    }
    catch (err) {
        // window.location.assign('/area-do-cliente')
        setError(err)
    }
}

isHolder().then(response => {
    submitEmailButton.classList.remove('is-disabled')
    tokenQtd.innerText = response?.data.user.tokenQtd
    licensesInfo.innerText = `Isso te dá direito a ${response?.data.user.tokenQtd} licenças`
    textAvailableLicenses.style.marginTop = '12px'
    addForm(response.data.user.tokenQtd, response.data.user.cursoEmails, response.data.user.claimCurso)
}).catch(err => {
    setError(err)
})

const getSubmitEmail = async (value, button, input) => {
    try {
        prepareError()
        button.innerText = 'Resgatando..'
        await axios.post(process.env.SERVER + 'users/claim-curso', { emails: [value], projectId: process.env.PROJECT_ID }, {
        })
        sucessClaim.classList.remove('is-hidden')
        button.classList.add('is-disabled')
        button.innerText = 'RESGATADO'
        input.readOnly = true
        input.style.backgroundColor = '#555'

    } catch (err) {
        console.log(err)
        setError(err.response?.data)
        button.innerText = 'RESGATAR'
    }

}



submitEmailButton.addEventListener('click', submitEmail)

// verifica se o usuário tem o metamask instalado
if (!window.ethereum) {
    console.log('Instale o metamask!')
}