export const httpLogin = async function(username, password) {
    
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // This is IMPORTANT for cookies to work
        body: JSON.stringify({ username: username, password: password})
    };

    return fetch(`${process.env.REACT_APP_API_URL}/auth`, requestOptions)
        .then(response => {
            if (!response.ok) throw response;
            return response.json();
        })
}

export const httpLogout = async function() {
    return fetch(`${process.env.REACT_APP_API_URL}/auth/logout`, { credentials: 'include' }) // This is IMPORTANT for cookies to work
        .then(response => {
            if (!response.ok) throw response;
            return response.json();
        })
}