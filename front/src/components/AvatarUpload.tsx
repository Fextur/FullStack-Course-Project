import { Avatar } from "@mui/material";
import { Camera } from "lucide-react";

interface IAvatarUploadProps {
  image: string;
  setImage?: (image: string) => void;
  size?: number;
  displayOnly?: boolean;
}

const AvatarUpload: React.FC<IAvatarUploadProps> = ({
  image,
  setImage,
  size = 90,
  displayOnly = false,
}) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (setImage && e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <label
        htmlFor={displayOnly ? "" : "image-upload"}
        style={{ cursor: displayOnly ? "default" : "pointer" }}
      >
        <Avatar
          src={image}
          style={{
            width: size,
            height: size,
            border: "3px solid #ccc",
            transition: "0.3s",
            cursor: displayOnly ? "default" : "pointer",
          }}
          onMouseOver={(e) =>
            !displayOnly && (e.currentTarget.style.filter = "brightness(0.7)")
          }
          onMouseOut={(e) =>
            !displayOnly && (e.currentTarget.style.filter = "brightness(1)")
          }
        />

        {!displayOnly && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              background: "rgba(0, 0, 0, 0.7)",
              borderRadius: "50%",
              width: size / 3,
              height: size / 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Camera width={size / 5} height={size / 5} color="white" />
          </div>
        )}
      </label>

      {!displayOnly && (
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
      )}
    </div>
  );
};

export default AvatarUpload;
