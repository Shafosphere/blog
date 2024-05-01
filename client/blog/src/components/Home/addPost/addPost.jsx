import { useState } from "react";
import "./addPost.css";
import ReactQuill from "react-quill";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
export default function AddPost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");

  // Poprawione funkcje obsługi zmian
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleImageChange = (event) => {
    setImage(event.target.value);
  };

  // const handleContentChange = (event) => {
  //   setImage(event.target.value);
  // };

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/article", {
        title,
        description,
        image,
        content,
      }, {
        withCredentials: true
      });
      if (response.data.success) {
        //new logic
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Registration error", error);
      alert("An error occurred during registration");
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
              value={image}
            ></input>
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
        </form>
      </div>
    </div>
  );
}
