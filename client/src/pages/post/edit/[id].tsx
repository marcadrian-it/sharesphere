import React, { useState } from "react";
import { Button, Box } from "@chakra-ui/react";
import { Formik, Form } from "formik";

import { InputField } from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import { usePostQuery } from "../../../generated/graphql";
import { useUpdatePostMutation } from "../../../generated/graphql";
import { useGetIntId } from "../../../utils/useGetIntId";
import { useRouter } from "next/router";
import { withApollo2 } from "../../../utils/withApollo";
import { InputFile } from "../../../components/InputFile";

const EditPost = ({}) => {
  const Router = useRouter();
  const intId = useGetIntId();
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const { data, loading } = usePostQuery({
    skip: intId === -1,
    variables: {
      id: intId,
    },
  });
  const [editPost] = useUpdatePostMutation();
  if (loading) {
    return <Layout>Loading...</Layout>;
  }
  if (!data?.post) {
    return <Layout>Could not find post</Layout>;
  }

  return (
    <Layout variant="small">
      <Formik
        initialValues={{
          title: data.post.title,
          text: data.post.text,
          imageUrl: data.post.imageUrl,
        }}
        onSubmit={async (values) => {
          let finalImageUrl = imageUrl;

          // If the user has selected a file, upload it to Cloudinary
          if (file) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "cjbazo7v");
            const response = await fetch(
              `https://api.cloudinary.com/v1_1/dmzmqvehw/image/upload`,
              {
                method: "POST",
                body: formData,
              }
            );
            const data = await response.json();
            finalImageUrl = data.secure_url;
          } else if (imageUrl) {
            // Check if imageUrl is a valid URL
            try {
              new URL(imageUrl);
              // If the user has provided a valid imageUrl, upload it to Cloudinary
              const formData = new FormData();
              formData.append("file", imageUrl);
              formData.append("upload_preset", "cjbazo7v");
              const response = await fetch(
                `https://api.cloudinary.com/v1_1/dmzmqvehw/image/upload`,
                {
                  method: "POST",
                  body: formData,
                }
              );
              const data = await response.json();
              finalImageUrl = data.secure_url;
            } catch (error) {
              // If imageUrl is not a valid URL, call editPost with an empty imageUrl
              finalImageUrl = "";
            }
          }

          // Update the post with the final image URL
          await editPost({
            variables: {
              id: intId,
              ...values,
              imageUrl: finalImageUrl,
              prevImagePublicId: data.post
                ? data.post.imageUrl
                  ? data.post.imageUrl.match(/\/([^/]+)\.[^/.]+$/)?.[1]
                  : null
                : null,
            },
          });

          Router.push("/");
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="title" label="Title" />
            <Box mt={4}>
              <InputFile
                onFileChange={(file) => {
                  setFile(file);
                }}
                onImageUrlChange={(imageUrl) => {
                  setImageUrl(imageUrl);
                }}
              />
            </Box>
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

export default withApollo2({ ssr: false })(EditPost);
