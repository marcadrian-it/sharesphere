import { Box, Button, Flex } from "@chakra-ui/react";
import { Form, Formik } from "formik";

import { useRouter } from "next/router";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { InputFile } from "../components/InputFile";
import { Layout } from "../components/Layout";
import { useCreatePostMutation } from "../generated/graphql";
import { useIsAuth } from "../utils/useIsAuth";

import { withApollo2 } from "../utils/withApollo";

const CreatePost: React.FC<{}> = ({}) => {
  useIsAuth();
  const router = useRouter();
  const [createPost] = useCreatePostMutation();
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  return (
    <Layout variant="small">
      <Flex justifyContent="center">
        <Box
          p={5}
          bg="white"
          width={{ base: "350px", md: "600px" }}
          borderRadius="lg"
          border="1px"
          borderColor="gray.300"
        >
          <Formik
            initialValues={{ title: "", text: "" }}
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
                  // If imageUrl is not a valid URL, call createPost with an empty imageUrl this will cause resolver to create a placeholder image
                  finalImageUrl = "";
                }
              }

              // Create a new post with the final image URL
              const { errors } = await createPost({
                variables: { input: { ...values, imageUrl: finalImageUrl } },
                update: (cache) => {
                  cache.evict({ fieldName: "posts:{}" });
                },
              });
              if (!errors) {
                router.push("/");
              }
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
                    placeholder="description"
                    label="Body"
                  />
                </Box>
                <Button
                  mt={4}
                  type="submit"
                  isLoading={isSubmitting}
                  colorScheme="teal"
                >
                  Create Post
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Flex>
    </Layout>
  );
};

export default withApollo2({ ssr: false })(CreatePost);
