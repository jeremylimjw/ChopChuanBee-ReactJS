import React, { useEffect, useState } from 'react'
import { message, Spin, Typography } from 'antd'
import ProfileForm from '../components/general/ProfileForm'
import { useApp } from '../providers/AppProvider'
import { GeneralApiHelper } from '../api/general'
import UserProfileForm from '../components/general/UserProfileForm'

const ProfilePage = () => {
    const { user, handleHttpError } = useApp();
    const [profileData, setProfileData] = useState({})
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        if (loading) {
            initializeUser()
        }
    }, [loading])

    const initializeUser = async () => {
        let data = await GeneralApiHelper.getProfile(user.id)
        setProfileData(data)
        setLoading(false)
    }

    const updateProfile = async (data) => {
        let response = await GeneralApiHelper.updateProfile(data)
            .then((res) => { return res })
            .catch(handleHttpError)
        setLoading(true)
        if (response === 200) {
            message.success('Profile updated!')
        } else {
            message.error('Error updating profile, please try again')
        }
    }

    return <div>
        <Typography.Title>My Profile</Typography.Title>
        {loading ? <Spin />
            : <UserProfileForm
                profileData={profileData}
                user={user}
                updateProfile={updateProfile}
            />
        }

    </div>
}

export default ProfilePage 