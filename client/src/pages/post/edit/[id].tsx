import React from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { Button, Box } from "@chakra-ui/react";
import { Formik, Form } from "formik";

import { InputField } from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import { usePostQuery } from "../../../generated/graphql";
import { useUpdatePostMutation } from "../../../generated/graphql";
import { useGetIntId } from "../../../utils/useGetIntId";
import { useRouter } from "next/router";

const EditPost = ({}) => {
  const Router = useRouter();
  const intId = useGetIntId();
  const [{ data, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });
  const [, editPost] = useUpdatePostMutation();
  if (fetching) {
    return <Layout>Loading...</Layout>;
  }
  if (!data?.post) {
    return <Layout>Could not find post</Layout>;
  }

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values) => {
          await editPost({ id: intId, ...values });
          Router.push("/");
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="title" label="Title" />
            <Box mt={4}>
              <InputField
                height={300}
                width={500}
                textarea
                name="text"
                placeholder="text..."
                label="Body"
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              Edit Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(EditPost);
