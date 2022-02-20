import React from 'react'
import { Layout, Form, Button, Input, Row, Col, Typography, Modal } from 'antd'
import { EditOutlined, SaveOutlined } from '@ant-design/icons/lib/icons'
import { useEffect, useState } from 'react'
import { GeneralApiHelper } from '../../api/general'

const ProfileForm = ({ user }) => {
  const [profileForm] = Form.useForm();
  // const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(true);
  const [responseMessageVisibility, setResponseMessageVisibility] = useState(false);
  const [responseMessage, setResponseMessage] = useState();
  const [responseTitle, setResponseTitle] = useState();
  const [profileData, setProfileData] = useState();
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //     profileForm.name.setValue(user.name);
  //     console.log(profileForm.name);
  // })

  // const initializeUser = async () => {
  //     let data = await GeneralApiHelper.getProfile(user.id);
  //     setProfileData(data);
  // }

  // const defaultValues = { name:user.name, username:user.username, email:user.email, contactNumber:user.contact_number, address:user.address, postalCode:user.postal_code, nokName:user.nok_name, nokNumber:user.nok_number};

  // useEffect(() => {
  //     profileForm.setFieldsValue(defaultValues)
  //    }, [profileForm, defaultValues])

  const handleFinish = async (values) => {
    let result = await GeneralApiHelper.updateProfile(
      user.id,
      values.name,
      values.username,
      values.email,
      values.contactNumber,
      values.nokName,
      values.nokNumber,
      values.address,
      values.postalCode
    );
    if (result == "200") {
      setResponseTitle('Your profile has been updated.');
      setResponseMessage('Please refresh to see your updated profile.')
      // setProfileData(values);
      // profileForm.setFieldsValue(values);
      // console.log(values);
    } else {
      setResponseTitle('Your profile cannot be updated. Please try again or contact admin for support.');
      setResponseMessage(result)
    }
    profileForm.resetFields();
  }

  return (
    <>
      <Layout>
        <Form form={profileForm} onFinish={handleFinish}>
          <Row>
            {viewMode
              ? (
                <Form.Item>
                  <Button htmlType='submit' onClick={() => setViewMode(false)}><EditOutlined style={{ fontSize: '16px' }} />Edit</Button>
                </Form.Item>
              ) : (
                <Form.Item>
                  <Button htmlType='submit' onClick={() => { setViewMode(true); setResponseMessageVisibility(true); }} style={{ background: "black", borderColor: "black", color: "white" }}><SaveOutlined style={{ fontSize: '16px' }} />Save</Button>
                </Form.Item>
              )}
          </Row>

          <Row>
            <Col span={11}>
              <Form.Item
                label='Full name'
                name='name'
                initialValue={user.name || ''}
                rules={[
                  {
                    required: true,
                    message: 'Required',
                  },
                ]}
                style={{ fontWeight: 'bold' }}
              >
                {viewMode
                  ? <Typography style={{ backgroundColor: 'white', height: '30px', padding: '4px 11px', borderRadius: '2px', fontWeight: 'normal' }}> {user.name} </Typography>
                  : <Input />}
                {/* <Input disabled={viewMode} /> */}

              </Form.Item>
            </Col>
            <Col span={2} />
            <Col span={11}>
              <Form.Item
                label='Username'
                name='username'
                initialValue={user.username || ''}
                rules={[
                  {
                    required: true,
                    message: 'Required',
                  },
                ]}
                style={{ fontWeight: 'bold' }}
              >
                {viewMode
                  ? <Typography style={{ backgroundColor: 'white', height: '30px', padding: '4px 11px', borderRadius: '2px', fontWeight: 'normal' }}>{user.username}</Typography>
                  : <Input />}
                {/* <Input disabled={viewMode}/> */}
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={11}>
              <Form.Item
                label='Email Address'
                name='email'
                initialValue={user.email || ''}
                rules={[
                  {
                    required: true,
                    message: 'Required',
                  },
                ]}
                style={{ fontWeight: 'bold' }}
              >
                {viewMode
                  ? <Typography style={{ backgroundColor: 'white', height: '30px', padding: '4px 11px', borderRadius: '2px', fontWeight: 'normal' }}>{user.email}</Typography>
                  : <Input />}
                {/* <Input disabled={viewMode}/> */}
              </Form.Item>
            </Col>
            <Col span={2} />
            <Col span={11}>
              <Form.Item
                label='Contact Number'
                name='contactNumber'
                initialValue={user.contact_number || ''}
                style={{ fontWeight: 'bold' }}
              >
                {viewMode
                  ? <Typography style={{ backgroundColor: 'white', height: '30px', padding: '4px 11px', borderRadius: '2px', fontWeight: 'normal' }}>{user.contact_number}</Typography>
                  : <Input />}
                {/* <Input disabled={viewMode}/> */}
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={11}>
              <Form.Item
                label='Address'
                name='address'
                initialValue={user.address || ''}
                style={{ fontWeight: 'bold' }}
              >
                {viewMode
                  ? <Typography style={{ backgroundColor: 'white', height: '30px', padding: '4px 11px', borderRadius: '2px', fontWeight: 'normal' }}>{user.address}</Typography>
                  : <Input />}
                {/* <Input disabled={viewMode}/> */}
              </Form.Item>
            </Col>
            <Col span={2} />
            <Col span={11}>
              <Form.Item
                label='Postal Code'
                name='postalCode'
                initialValue={user.postal_code || ''}
                style={{ fontWeight: 'bold' }}
              >
                {viewMode
                  ? <Typography style={{ backgroundColor: 'white', height: '30px', padding: '4px 11px', borderRadius: '2px', fontWeight: 'normal' }}>{user.postal_code}</Typography>
                  : <Input />}
                {/* <Input disabled={viewMode}/> */}
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={11}>
              <Form.Item
                label='Next-Of-Kin Name'
                name='nokName'
                initialValue={user.nok_name || ''}
                style={{ fontWeight: 'bold' }}
              >
                {viewMode
                  ? <Typography style={{ backgroundColor: 'white', height: '30px', padding: '4px 11px', borderRadius: '2px', fontWeight: 'normal' }}>{user.nok_name}</Typography>
                  : <Input />}
                {/* <Input disabled={viewMode}/> */}
              </Form.Item>
            </Col>
            <Col span={2} />
            <Col span={11}>
              <Form.Item
                label='Next-Of-Kin Number'
                name='nokNumber'
                initialValue={user.nok_number || ''}
              >
                style={{ fontWeight: 'bold' }}
                {viewMode
                  ? <Typography style={{ backgroundColor: 'white', height: '30px', padding: '4px 11px', borderRadius: '2px', fontWeight: 'normal' }}>{user.nok_number}</Typography>
                  : <Input />}
                {/* <Input disabled={viewMode}/>  */}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Layout>

      {/* <Modal
                title = {responseTitle}
                visible = {responseMessageVisibility}
                footer = {null}>
                <Typography>{responseMessage}</Typography>
                <Button style={{marginTop: '20px' }} onClick={() => setResponseMessageVisibility(false)} type="primary">Okay</Button>
            </Modal> */}
    </>
  )
}

export default ProfileForm
