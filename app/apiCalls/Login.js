export const Login = () => {
    let url = 'https://echo-serv.tbxnet.com';
    let path = '/v1/mobile/auth';
    let method = 'POST';
    let body = {
        sub: 'ToolboxMobileTest',
    }
    console.log(body)
    return fetch(url + path,
        {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }
    )
        .then(handleErrors)
        .then(response =>
            response.json())
        .then(json => {
            console.log("LOGIN" + ' ' + 'OK')
            return json
            //console.log("RESPONSE", json)
            //dispatch({ type: MAKE_DEBIT_CARD_PAYMENT, payload: text });
        })
        .catch(error => {
            console.log('LOGIN_STATUS' + ' ' + error)
            //dispatch({ type: 'LOGIN_STATUS', payload: error.message });
        });
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.status);
    }
    return response;
}