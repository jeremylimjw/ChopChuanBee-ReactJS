import React from 'react'
import { Typography } from 'antd'
import ProfileForm from '../components/general/ProfileForm'
import { useApp } from '../providers/AppProvider'

const ProfilePage = () => {
    const { user } = useApp();

    return <div>
        <Typography.Title>My Profile</Typography.Title>
        <ProfileForm user={user}/>
    </div>
}

export default ProfilePage