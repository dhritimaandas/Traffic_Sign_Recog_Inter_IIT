import { useState } from "react";
import { uploadHandler } from "../context/storage";

export default function firebasPage() {
  const handle = (event) => {
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
      <input type="file" onChange={handle} accept="image/*" multiple />
    </>
  );
}
