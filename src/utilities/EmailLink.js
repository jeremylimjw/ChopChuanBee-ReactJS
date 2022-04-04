import React from 'react'

export default function EmailLink({ email }) {
    return (
        <>
        { email ? 
            <a href={`mailto:${email}`} title={`Write an email to ${email}`}>{email}</a>
            : 
            '-'
        }
        </>
    )
}
