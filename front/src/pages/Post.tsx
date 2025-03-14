import { useContent } from "@/hooks/useContent";
import { usePosts } from "@/hooks/usePosts";
import { useUser } from "@/hooks/useUser";
import { ContentType } from "@/types";
import {
  Box,
  Button,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "@tanstack/react-router";
import { Upload } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";

const Post = () => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [content, setContent] = useState<string>("");

  const { id } = useParams({ strict: false });
  const { user } = useUser();
  const { generateContent } = useContent();
  const { createPostMutation, updatePostMutation, deletePostMutation, posts } =
    usePosts();

  useEffect(() => {
    if (id) {
      const currentPost = posts.find((post) => post.id === id);
      if (currentPost) {
        setContent(currentPost.content);
        setImagePreviewUrl(currentPost.image);
      }
    }
  }, [id]);

  const handleContentGenerate = async (contentType: ContentType) => {
    const newContent = await generateContent(contentType);
    setContent(newContent);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];

    if (file) {
      setImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          width: "100%",
          padding: "5px 30px",
          alignItems: "flex-start",
          height: "90%",
        }}
      >
        <Box
          sx={{
            width: "500px",
            height: "500px",
            display: "flex",
            alignItems: "center",
            background: imagePreviewUrl ? "none" : "aliceblue",
            border: "1px solid lightgray",
            justifyContent: "center",
            borderRadius: "20px",
            padding: "5px",
            overflow: "hidden",
          }}
        >
          {imagePreviewUrl ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "flex-end",
                width: "100%",
                height: "100%",
              }}
            >
              <img
                src={imagePreviewUrl}
                alt="Preview"
                style={{
                  objectFit: "contain",
                  width: "100%",
                  height: "100%",
                }}
              />
              <label htmlFor="upload-photo-input">
                <Button component="span">
                  change photo
                  <input
                    id="upload-photo-input"
                    accept="image/*"
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                </Button>
              </label>
            </div>
          ) : (
            <label htmlFor="upload-photo-input">
              <IconButton color="primary" component="span">
                <Upload />
                <input
                  id="upload-photo-input"
                  accept="image/*"
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
              </IconButton>
            </label>
          )}
        </Box>

        <div style={{ padding: "5px 30px", width: "50%" }}>
          <TextField
            sx={{ width: "100%", borderRadius: "20px" }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write something about the post"
            multiline
            rows={10}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography>Generate content: </Typography>
            <Button onClick={() => handleContentGenerate(ContentType.JOKE)}>
              Joke
            </Button>
            <Button onClick={() => handleContentGenerate(ContentType.QUOTE)}>
              Quote
            </Button>
            <Button onClick={() => handleContentGenerate(ContentType.FUN_FACT)}>
              Fun fact
            </Button>
          </div>
          <Divider />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              size="large"
              sx={{ marginTop: "5px" }}
              disabled={!content.length || !imagePreviewUrl}
              onClick={() => {
                if (user && content && imagePreviewUrl)
                  id
                    ? updatePostMutation.mutate({
                        postId: id as string,
                        content: content,
                        image: image,
                      })
                    : createPostMutation.mutate({
                        content: content,
                        image: image,
                      });
              }}
            >
              {id ? "EDIT" : "POST"}
            </Button>
            {id && (
              <Button
                size="large"
                color="error"
                sx={{ marginTop: "5px" }}
                onClick={() => {
                  deletePostMutation.mutate({ postId: id });
                }}
              >
                {"DELETE"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
