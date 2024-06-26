import { useContext } from 'react';
import { Alert, Button, Form, Stack, Row, Col } from 'react-bootstrap'
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const { loginInfo, updateLoginInfo, loginUser, isLoginLoading, loginError } = useContext(AuthContext);

    return (<>
        <Form onSubmit={loginUser}>
            <Row style={{ height: '80vh', justifyContent: 'center', paddingTop: '10%' }}>
                <Col xs={6}>
                    <Stack gap='3'>
                        <h3>Login</h3>
                        <Form.Control type="email" placeholder='Enter email' onChange={(e) => {
                            updateLoginInfo({ ...loginInfo, email: e.target.value });
                        }} />
                        <Form.Control type="password" placeholder='Enter password' onChange={(e) => {
                            updateLoginInfo({ ...loginInfo, password: e.target.value });
                        }} />
                        <Button variant='primary' type='submit'>
                            {isLoginLoading ? 'Logging you in' : 'Login'}
                        </Button>
                        {loginError?.error && <Alert variant='danger'>{loginError.message}</Alert>}
                    </Stack>
                </Col>
            </Row>
        </Form>
    </>);
}

export default Login;