import { useState } from "react";
import { uploadHandler, downloadHandler } from "../context/storage";

export default function FirebasPage() {
  const [clas, setClas] = useState(0);

  const handleUpload = (event) => {
    let i = 0;
    let files = [];
    while (i < event.target.files.length) {
      files.push({
        file: event.target.files[i], // file
        class: String(i), // class
      });
      i++;
    }
    uploadHandler(files);
  };

  return (
    <>
      <input type="file" onChange={handleUpload} accept="image/*" multiple />
      <button type="submit" id="down" onChange={downloadHandler}>
        Download
      </button>
    </>
  );
}
