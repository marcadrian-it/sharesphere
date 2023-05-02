import React, { useState } from "react";
import { NextPage } from "next";
import { Formik, Form } from "formik";
import { Box, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { toErrorMap } from "../../utils/toErrorMap";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import {
  MeDocument,
  MeQuery,
  useChangePasswordMutation,
} from "../../generated/graphql";

import NextLink from "next/link";
import { Link } from "@chakra-ui/react";
import { withApollo2 } from "../../utils/withApollo";

const ChangePassword: NextPage<{ token: string }> = () => {
  const router = useRouter();
  const [ChangePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await ChangePassword({
            variables: {
              token:
                typeof router.query.token === "string"
                  ? router.query.token
                  : "",
              newPassword: values.newPassword,
            },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.ChangePassword.user,
                },
              });
            },
          });

          if (response.data?.ChangePassword.errors) {
            const errorMap = toErrorMap(response.data.ChangePassword.errors);
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.ChangePassword.user) {
            // it worked
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              placeholder="new password"
              label="New Password"
              type="password"
            />

            {tokenError ? (
              <Box>
                <Box color="red">{tokenError}</Box>
                <Link as={NextLink} href="/forgot-password">
                  get new recovery token here
                </Link>
              </Box>
            ) : null}
            <Button
              mt={4}
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              change password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo2({ ssr: false })(ChangePassword);
