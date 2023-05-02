import React from "react";
import { useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import { InputField } from "./InputField";

interface InputFileProps {
  onFileChange: (file: File | null) => void;
  onImageUrlChange: (imageUrl: string) => void;
}

export const InputFile: React.FC<InputFileProps> = ({
  onFileChange,
  onImageUrlChange,
}) => {
  const [uploadMethod, setUploadMethod] = useState<"file" | "url" | null>(null);

  return (
    <>
      <Box>
        <Button
          onClick={() => setUploadMethod("file")}
          variant={uploadMethod === "file" ? "solid" : "outline"}
        >
          Upload image
        </Button>
        <Button
          onClick={() => setUploadMethod("url")}
          variant={uploadMethod === "url" ? "solid" : "outline"}
        >
          Upload image from a link
        </Button>
      </Box>

      {uploadMethod === "file" && (
        <Box>
          Image
          <br />
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              if (event.target.files && event.target.files.length > 0) {
                const file = event.target.files[0];
                onFileChange(file);
              }
            }}
          />
        </Box>
      )}

      {uploadMethod === "url" && (
        <InputField
          name="imageUrl"
          placeholder="Image URL"
          label="Image URL"
          onChange={(event) => {
            const imageUrl = event.target.value;
            onImageUrlChange(imageUrl);
          }}
        />
      )}
    </>
  );
};
