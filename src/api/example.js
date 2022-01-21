export const httpExample = async function() {
    return fetch(
            'http://localhost:3000/api/users', 
            { credentials: 'include' } // This is IMPORTANT for cookies to work
        )
        .then(response => {
            if (!response.ok) throw response;
            return response.json();
        })
}