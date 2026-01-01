import { useState } from "react";

export default function ImageUploader({ images, setImages }: any) {
  const handleFiles = (files: FileList) => {
    const selected = Array.from(files).slice(0, 5 - images.length);
    setImages([...images, ...selected]);
  };

  const moveImage = (from: number, to: number) => {
    const arr = [...images];
    const item = arr.splice(from, 1)[0];
    arr.splice(to, 0, item);
    setImages(arr);
  };

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={e => handleFiles(e.target.files!)}
      />

      <div className="flex gap-2 mt-3">
        {images.map((img: File, i: number) => (
          <div
            key={i}
            draggable
            onDragStart={e => e.dataTransfer.setData("i", i.toString())}
            onDrop={e => {
              const from = Number(e.dataTransfer.getData("i"));
              moveImage(from, i);
            }}
            onDragOver={e => e.preventDefault()}
            className="relative w-20 h-20 border rounded overflow-hidden"
          >
            <img
              src={URL.createObjectURL(img)}
              className="w-full h-full object-cover"
            />
            {i === 0 && (
              <span className="absolute bottom-0 w-full bg-black/70 text-xs text-white text-center">
                Thumbnail
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
