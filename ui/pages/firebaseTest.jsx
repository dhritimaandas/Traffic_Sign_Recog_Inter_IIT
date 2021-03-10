import { useState } from "react";
import { uploadHandler,downHandler } from "../context/storage";

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

  const handleDown = () => {
    downHandler(clas);
  };
  const inputclas = (event) => {
      setClas(event.target.value)
  }

  
  return (
    <>
      <input type="file" onChange={handleUpload} accept="image/*" multiple />
      <input type="number" id="down" onChange={inputclas}/>
      <input type="submit" value="Get Images" onClick={handleDown} />
    </>
  );
}
