import { useState } from "react";
import "./addPost.css";
import ReactQuill from "react-quill";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
export default function AddPost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [content, setContent] = useState("");

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleImageChange = (event) => {
    setImageLink(event.target.value);
  };

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      // Przechowujesz sam plik
      setImageFile(event.target.files[0]);
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("content", content);
    if (imageFile) {
      formData.append("imageFile", imageFile);
    } else if (imageLink) {
      formData.append("imageLink", imageLink);
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/article",
        formData, // Używasz FormData zamiast JSON
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        alert("Your post has been added successfully!");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Got an error while adding your post", error);
    }
  }

  return (
    <div className="container-add">
      <div className="window-add">
        <form onSubmit={handleSubmit}>
          <div>
            <label className="label-style">
              Title <span className="required-span">*</span>
            </label>
            <input
              className="input-style"
              type="text"
              name="title"
              id="title"
              placeholder="title of the article"
              onChange={handleTitleChange}
              value={title}
              required
            ></input>
          </div>
          <div>
            <label className="label-style">Description </label>
            <input
              className="input-style"
              type="text"
              name="description"
              id="description"
              placeholder="short description displayed on the home page"
              onChange={handleDescriptionChange}
              value={description}
            ></input>
          </div>
          <div>
            <label className="label-style">Image </label>
            <input
              className="input-style"
              type="text"
              name="image"
              id="image"
              placeholder="link to the image"
              onChange={handleImageChange}
              value={imageLink}
            ></input>
            <input
              className="input-style"
              type="file"
              name="imageFile"
              id="imageFile"
              onChange={handleFileChange}
            />
          </div>
          <div>
            <label className="label-style">
              Content <span className="required-span">*</span>
            </label>
            <ReactQuill
              className="react-quill-container"
              theme="snow"
              value={content}
              onChange={setContent}
            />
          </div>
          <button className="button" type="submit">
            Add Post
          </button>
        </form>
      </div>
    </div>
  );
}
