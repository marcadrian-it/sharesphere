import React from "react";
import { Form, Formik } from "formik";
import { Box, Button } from "@chakra-ui/react";
import dynamic, { LoaderComponent } from "next/dynamic";
import { WrapperProps } from "../components/Wrapper";
import { InputFieldProps } from "../components/InputField";

const DynamicWrapper = dynamic<WrapperProps>(
  () => import("../components/Wrapper") as LoaderComponent<WrapperProps>
);
const DynamicInputField = dynamic<InputFieldProps>(
  () => import("../components/InputField") as LoaderComponent<InputFieldProps>
);
import { useForgotPasswordMutation } from "../generated/graphql";
import { useState } from "react";
import { withApollo2 } from "../utils/withApollo";

const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();
  return (
    <DynamicWrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          await forgotPassword({ variables: values });
          setComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box>
              If an account with that email exists, we sent you an email
            </Box>
          ) : (
            <Form>
              <DynamicInputField
                name="email"
                placeholder="email"
                label="Email"
                type="email"
              />
              <Button
                mt={4}
                type="submit"
                colorScheme="teal"
                isLoading={isSubmitting}
                aria-label="Forgot Password"
              >
                forgot password
              </Button>
            </Form>
          )
        }
      </Formik>
    </DynamicWrapper>
  );
};

export default withApollo2({ ssr: false })(ForgotPassword);
