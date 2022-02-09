import React, {useState} from 'react';
import { Form, Typography, Input, Button, message } from 'antd';
import { GeneralApiHelper } from '../../api/general';
import { useApp } from '../../providers/AppProvider';

const ForgotPasswordForm = (props) => {
    const { removeSession } = useApp();
    const [forgotPasswordForm] = Form.useForm();
    const { Title, Text } = Typography;
    const [ successMessageVisibility, setSuccessMessageVisibility ] = useState(false);

    const handleFinish = async (values) => {
        GeneralApiHelper.resetPassword(values.username, values.email)
            .then(() => {
                setSuccessMessageVisibility(true);
            })
            .catch(error => {
                if (error.response) {
                    if (error.response.status === 333) {
                        removeSession();
                        message.error('Login session timed out. Please login again.');
                    } else {
                        message.error(error.response.data);
                    }
                } else if (error.request) {
                    console.log(error.request);
                    message.error('The request was made but no response was received.')
                } else {
                    console.log(error.message);
                    message.error('Something happened in setting up the request that triggered an Error.')
                }
            })
    }

    return (
        <>
        {successMessageVisibility

        ? (<>
        <Title level={4}>Check your email</Title>
        <Text>We have sent you an email with a new password. Please login using the new password.</Text><br/>
        </>)

        : (<>
        <Title level={4}>Forgotten your password?</Title>
        <Text>We will send you an email to help reset your password.</Text>

        <Form form={forgotPasswordForm} onFinish={handleFinish} style={{marginTop:'20px'}}>
            <Form.Item
                name="username"
                rules={[
                    {
                      required: true,
                      message: 'Username required',
                    },
                  ]}
            > 
                <Input type="text" className='input' placeholder='Username' />
            </Form.Item>
            
            <Form.Item
                name="email"
                rules={[
                    {
                      required: true,
                      message: 'Email required',
                    },
                  ]}
            > 
                <Input type="text" className='input' placeholder='Email' />
            </Form.Item>

            <Form.Item>
                <Button className='button' type="primary" htmlType="submit" >
                Send email
                </Button>
            </Form.Item>
        </Form>
        </>)
        }
        </>
    )
}

export default ForgotPasswordForm