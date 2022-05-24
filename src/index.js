import axios from 'axios'

const usedLicenses = document.querySelector('.used-licenses')
const availableLicenses = document.querySelector('.available-license')
const wallet = document.querySelector('.wallet')
const submitEmailButton = document.querySelector('.submit-email')
const inputEmail = document.querySelector('.input-email')
const loadingWrapper = document.querySelector('.loading-wrapper')
const errorWrapper = document.querySelector('.error-wrapper')
const errorMessage = document.querySelector('.error-message')
const loadingWallet = document.querySelector('.animation-text')
const textAvailableLicenses = document.querySelector('.text-available-licenses')
const emailForm = document.querySelector('.email-form')
inputEmail.style.color = 'white'

let address = 0

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
    loadingWrapper.classList.add('is-hidden')
}

const isHolder = async () => {
    try {
        const accounts = await window.ethereum.request({
            method: "eth_accounts",
        });
        console.log(accounts[0])
        address = accounts[0]

        if (accounts.length > 0) {
            const response = await axios.get(process.env.SERVER + `users/info?address=${address}`, {
                headers: {
                    authentication: process.env.AUTHENTICATION
                }
            })
            submitEmailButton.classList.remove('is-disabled')
            loadingWallet.classList.add('is-hidden')
            textAvailableLicenses.classList.remove('is-hidden')

            if (response?.data.user.tokenQtd === 0) {
                window.location.assign('/not-holder')
            }

            return response
        }


    }
    catch (err) {
        // window.location.assign('/area-do-cliente')
        console.log(err)
    }
}

isHolder().then(response => {
    console.log('res', response)
    usedLicenses.innerText = response.data.user.tokenQtd - response.data.user.claimCurso;
    availableLicenses.innerText = response.data.user.tokenQtd;
    wallet.innerText = address.substring(0, 5) + '...' + address.substring(address.length - 4, address.length)
    submitEmailButton.classList.remove('is-disabled')
    if (response.data.user.tokenQtd === response.data.user.claimCurso) {
        textAvailableLicenses.innerText = 'Você já utilizou todas as licenças disponíveis'
        emailForm.classList.add('is-hidden')
    }
})

const getSubmitEmail = async () => {
    try {
        setLoading();
        return await axios.post(process.env.SERVER + 'users/claim-curso', { address, emails: [inputEmail.value] }, {
            headers: {
                authentication: process.env.AUTHENTICATION
            }
        })
    } catch (err) {
        prepareError()
        console.log(err)
        setError(err.response?.data)
        submitEmailButton.classList.remove('is-hidden')
    }

}

const submitEmail = async () => {
    const response = await getSubmitEmail()
    if (response) {
        window.location.assign('/sucesso-curso')
    }
}

submitEmailButton.addEventListener('click', submitEmail)

// verifica se o usuário tem o metamask instalado
if (!window.ethereum) {
    console.log('Instale o metamask!')
}