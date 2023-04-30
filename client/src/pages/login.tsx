import React from 'react'
import { Form, Formik } from 'formik'
import {  Box, Button, Link } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from 'next/link';





const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
    const [,login] = useLoginMutation();
        return (
            <Wrapper variant='small'>
            <Formik initialValues={{usernameOrEmail:"", password:""}}
            onSubmit={async (values, {setErrors}) => {
                const response = await login(values);
                if (response.data?.login.errors) {
                setErrors(toErrorMap(response.data.login.errors));
                }
                else if (response.data?.login.user) {
                  if (typeof router.query.next === "string") {
                    router.push(router.query.next);
                  } else {
                  router.push("/");
                }
                }
            }}
            >
                {({isSubmitting}) => (
                    <Form>
                        <InputField name="usernameOrEmail" placeholder="username or email" label="Username or Email" />
                        <Box mt={4}>
                        <InputField name="password" placeholder="password" label="Password" type="password" />
                        </Box>
                        <Box mt={2}>
                        <Link as={NextLink} href="/forgot-password">recover password</Link>
                        </Box>
                        <Button mt={4} type="submit" colorScheme="teal" isLoading={isSubmitting}>login</Button>
                    </Form>
            
        )}
        </Formik>
        </Wrapper>
        );
}

export default withUrqlClient(createUrqlClient)(Login);
