import { EditOutlined, SaveOutlined } from '@ant-design/icons/lib/icons'
import { Button, Form, Typography, Input, Spin } from 'antd'
import '../../css/ProfilePage.css'
import React, { useEffect, useState } from 'react'

const UserProfileForm = (props) => {
  let profileData = props.profileData
  const [loading, setLoading] = useState(true)
  const [formRenderState, setFormRenderState] = useState(true)
  const [actionState, setActionState] = useState(true)
  const [profileForm] = Form.useForm()

  // Set the initial state to viewing mode
  useEffect(() => {
    handleViewModeChange(true)
  }, [])

  /**
   * 
   * @param {*} mode true for view mode and false for edit mode 
   * Manages the toggle between view and edit state for the form component and renders the corresponding component
   */
  const handleViewModeChange = (mode) => {
    switch (mode) {
      case true:
        setActionState(true)
        setFormRenderState(viewModeForm)
        break
      case false:
        setActionState(false)
        setFormRenderState(editModeForm)
        break
      default:
        break
    }
  }

  const handleFinish = (values) => {
    if (actionState) {
      handleViewModeChange(false)
    } else {
      let formData = {
        ...values,
        id: profileData.id
      }
      props.updateProfile(formData)
      handleViewModeChange(true)
    }
  }

  // Viewing Mode
  const viewModeForm = <React.Fragment>
    <Form.Item>
      <Button htmlType='submit'>
        <EditOutlined style={{ fontSize: '16px' }} /> Edit
      </Button>
    </Form.Item>

    <Form.Item
      label='Full Name'
      name='name'
    >
      <Typography className='profile-form-data'>{profileData.name}</Typography>
    </Form.Item>
    <Form.Item
      label='Username'
      name='username'
    >
      <Typography className='profile-form-data'>{profileData.username}</Typography>
    </Form.Item>
    <Form.Item
      label='Email Address'
      name='email'
    >
      <Typography className='profile-form-data'>{profileData.email}</Typography>
    </Form.Item>
    <Form.Item
      label='Contact Number'
      name='contact_number'
    >
      <Typography className='profile-form-data'>{profileData.contact_number}</Typography>
    </Form.Item>
    <Form.Item
      label='Address'
      name='address'
    >
      <Typography className='profile-form-data'>{profileData.address}</Typography>
    </Form.Item>
    <Form.Item
      label='Postal Code'
      name='postal_code'
    >
      <Typography className='profile-form-data'>{profileData.postal_code}</Typography>
    </Form.Item>
    <Form.Item
      label='Next-of-Kin Name'
      name='nok_name'
    >
      <Typography className='profile-form-data'>{profileData.nok_name}</Typography>
    </Form.Item>
    <Form.Item
      label='Next-of-Kin Number'
      name='nok_number'
    >
      <Typography className='profile-form-data'>{profileData.nok_number}</Typography>
    </Form.Item>
  </React.Fragment>

  // Editing Mode
  const editModeForm = <React.Fragment>
    <Form.Item>
      <Button className='profile-edit-button' htmlType='submit'>
        <SaveOutlined style={{ fontSize: '16px' }} />Save Changes
      </Button>
    </Form.Item>
    <Form.Item
      label='Full Name'
      name='name'
    >
      <Input />
    </Form.Item>
    <Form.Item
      label='Username'
      name='username'
    >
      <Input disabled={true} />
    </Form.Item>
    <Form.Item
      label='Email Address'
      name='email'
    >
      <Input />
    </Form.Item>
    <Form.Item
      label='Contact Number'
      name='contact_number'
    >
      <Input />
    </Form.Item>
    <Form.Item
      label='Address'
      name='address'
    >
      <Input />
    </Form.Item>
    <Form.Item
      label='Postal Code'
      name='postal_code'
    >
      <Input />
    </Form.Item>
    <Form.Item
      label='Next-of-Kin Name'
      name='nok_name'
    >
      <Input />
    </Form.Item>
    <Form.Item
      label='Next-of-Kin Number'
      name='nok_number'
    >
      <Input />
    </Form.Item>
  </React.Fragment>


  return (
    <div>
      <Form
        layout='vertical'
        form={profileForm}
        onFinish={handleFinish}
        initialValues={profileData}
      >
        {formRenderState}
      </Form>
    </div>
  )
}

export default UserProfileForm