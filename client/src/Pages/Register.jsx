import { Alert, Button, Form, Stack, Row, Col } from 'react-bootstrap'
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const { registerInfo, updateRegisterInfo, registerUser, registerError, isRegisterLoading } = useContext(AuthContext);

    return (<>
        <Form onSubmit={registerUser}>
            <Row style={{ height: '80vh', justifyContent: 'center', paddingTop: '10%' }}>
                <Col xs={6}>
                    <Stack gap='3'>
                        <h3>Register</h3>
                        <Form.Control type="text" placeholder='Enter name' onChange={(event) => {
                            updateRegisterInfo({ ...registerInfo, name: event.target.value })
                        }} />
                        <Form.Control type="email" placeholder='Enter email' onChange={(event) => {
                            updateRegisterInfo({ ...registerInfo, email: event.target.value })
                        }} />
                        <Form.Control type="password" placeholder='Enter password' onChange={(event) => {
                            updateRegisterInfo({ ...registerInfo, password: event.target.value })
                        }} />
                        <Button variant='primary' type='submit'>
                            {isRegisterLoading ? 'Creating your account' : 'Register'}
                        </Button>
                        {registerError?.error && <Alert variant='danger'>{registerError?.message}</Alert>}
                    </Stack>
                </Col>
            </Row>
        </Form>
    </>);
}

export default Register;