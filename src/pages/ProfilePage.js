import React, { useEffect, useState } from 'react'
import { message, Spin, Typography } from 'antd'
import ProfileForm from '../components/general/ProfileForm'
import { useApp } from '../providers/AppProvider'
import { GeneralApiHelper } from '../api/general'
import UserProfileForm from '../components/general/UserProfileForm'
import MyLayout from '../components/layout/MyLayout'
import MyCard from '../components/layout/MyCard'

const ProfilePage = () => {
    const { user, handleHttpError } = useApp();
    const [profileData, setProfileData] = useState({})
    const [loading, setLoading] = useState(true)
    const breadcrumbs = [
        { url: '/user/profile', name: 'Profile page' }
    ]

    useEffect(() => {
        if (loading) {
            initializeUser()
        }
    }, [loading])

    const initializeUser = async () => {
        let data = await GeneralApiHelper.getProfile(user.id)
        setProfileData(data[0])
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
        return response
    }

    return <MyLayout
        breadcrumbs={breadcrumbs}
        bannerTitle='My Profile'
    >
        {loading ? <Spin />
            :
            <MyCard
                title='Personal Particulars'
            >
                <UserProfileForm
                    profileData={profileData}
                    user={user}
                    updateProfile={updateProfile}
                />
            </MyCard>
        }
    </MyLayout>
}

export default ProfilePage 