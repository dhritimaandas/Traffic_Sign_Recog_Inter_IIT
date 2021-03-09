import { useState } from "react";
import { uploadHandler } from "../context/storage";

export default function firebasPage() {
  const handle = (event) => {
    uploadHandler(event.target.files);
  };
  return (
    <>
      <input type="file" onChange={handle} accept="image/*" multiple />
    </>
  );
}
