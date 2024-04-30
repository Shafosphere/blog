import { useState } from "react";
import "./addPost.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
export default function AddPost() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
  
    // Poprawione funkcje obsługi zmian
    const handleTitleChange = (event) => {
      setTitle(event.target.value);
    };
  
    const handleDescriptionChange = (event) => {
      setDescription(event.target.value);
    };
  
    return (
      <div className="container-add">
        <div className="window-add">
          <form method="POST">
            <div>
              <label className="label-style">
                Title <span className="required-span">*</span>
              </label>
              <input
                className="input-style"
                type="text"
                name="title"
                id="title"
                onChange={handleTitleChange} // Użyj poprawionej funkcji obsługi zmian
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
                onChange={handleDescriptionChange} // Użyj poprawionej funkcji obsługi zmian
                value={description}
                required
              ></input>
            </div>
            <div>
              <label className="label-style">
                Content <span className="required-span">*</span>
              </label>
              <ReactQuill theme="snow" value={content} onChange={setContent} />
            </div>
          </form>
        </div>
      </div>
    );
  }
  