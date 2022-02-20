import { EditOutlined, SaveOutlined } from '@ant-design/icons/lib/icons'
import { Button, Form, Typography, Input, Spin } from 'antd'
import '../../css/ProfilePage.css'
import React, { useEffect, useState } from 'react'
import { GeneralApiHelper } from '../../api/general'
import { useApp } from '../../providers/AppProvider'

const UserProfileForm = (props) => {
  const { handleHttpError } = useApp()
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState({})
  const [formRenderState, setFormRenderState] = useState(true)
  const [actionState, setActionState] = useState(true)
  const [profileForm] = Form.useForm()

  // Set the initial state to viewing mode
  useEffect(() => {
    if (loading) {
      fetchEmployeeProfileData()
    } else {
      handleViewModeChange(true)
    }
  }, [loading])

  const fetchEmployeeProfileData = async () => {
    let data = await GeneralApiHelper.getProfile(props.user.id)
      .catch(handleHttpError)
    setProfileData(data[0])
    setLoading(false)
  }

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

  const handleFinish = async (values) => {
    if (actionState) {
      handleViewModeChange(false)
    } else {
      let formData = {
        ...values,
        id: profileData.id
      }
      console.log(formData)
      props.updateProfile(formData)
    }
  }

  // Viewing Mode
  const viewModeForm = <React.Fragment>
    <Form.Item
      label='Full Name'
      name='name'
    >
      <Typography >{profileData.name}</Typography>
    </Form.Item>
    <Form.Item
      hidden={true}
      label='Username'
      name='username'
    >
      <Typography >{profileData.username}</Typography>
    </Form.Item>
    <Form.Item
      label='Email Address'
      name='email'
    >
      <Typography >{profileData.email}</Typography>
    </Form.Item>
    <Form.Item
      label='Contact Number'
      name='contact_number'
    >
      <Typography >{profileData.contact_number}</Typography>
    </Form.Item>
    <Form.Item
      label='Address'
      name='address'
    >
      <Typography >{profileData.address}</Typography>
    </Form.Item>
    <Form.Item
      label='Postal Code'
      name='postal_code'
    >
      <Typography >{profileData.postal_code}</Typography>
    </Form.Item>
    <Form.Item
      label='NOK Name'
      name='nok_name'
    >
      <Typography >{profileData.nok_name}</Typography>
    </Form.Item>
    <Form.Item
      label='NOK Number'
      name='nok_number'
    >
      <Typography >{profileData.nok_number}</Typography>
    </Form.Item>
    <Form.Item wrapperCol={{ offset: 4, span: 10 }}>
      <Button htmlType='submit'>
        <EditOutlined style={{ fontSize: '16px' }} /> Edit
      </Button>
    </Form.Item>
  </React.Fragment>

  // Editing Mode
  const editModeForm = <React.Fragment>

    <Form.Item
      rules={[{ required: true, message: 'Full name required!' }]}
      label='Full Name'
      name='name'
    >
      <Input />
    </Form.Item>
    <Form.Item
      hidden={true}
      label='Username'
      name='username'
    >
      <Input disabled={true} />
    </Form.Item>
    <Form.Item
      rules={[{ required: true, message: 'Email required!' }]}
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
      label='NOK Name'
      name='nok_name'
    >
      <Input />
    </Form.Item>
    <Form.Item
      label='NOK Number'
      name='nok_number'
    >
      <Input />
    </Form.Item>
    <Form.Item wrapperCol={{ offset: 4, span: 10 }}>
      <Button htmlType='submit'>
        <SaveOutlined style={{ fontSize: '16px' }} />Save Changes
      </Button>
    </Form.Item>
  </React.Fragment>


  return (
    <div>
      {loading ? <Spin /> :
        <Form
          labelCol={{ span: 4 }} wrapperCol={{ span: 10 }}
          form={profileForm}
          onFinish={handleFinish}
          initialValues={profileData}
        >
          {formRenderState}
        </Form>
      }
    </div>

  )
}

export default UserProfileForm