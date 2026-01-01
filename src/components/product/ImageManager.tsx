export default function ImageManager({ images, setImages }: any) {
  const addImages = (files: FileList) => {
    const urls = Array.from(files).slice(0, 5 - images.length).map(f =>
      URL.createObjectURL(f)
    );
    setImages([...images, ...urls]);
  };

  const move = (from: number, to: number) => {
    const copy = [...images];
    const i = copy.splice(from, 1)[0];
    copy.splice(to, 0, i);
    setImages(copy);
  };

  return (
    <div>
      <input type="file" multiple accept="image/*" onChange={e => addImages(e.target.files!)} />

      <div className="flex gap-3 mt-3 flex-wrap">
        {images.map((img: string, i: number) => (
          <div
            key={i}
            draggable
            onDragStart={e => e.dataTransfer.setData("i", i.toString())}
            onDrop={e => move(Number(e.dataTransfer.getData("i")), i)}
            onDragOver={e => e.preventDefault()}
            className="w-24 h-24 rounded-xl overflow-hidden bg-white/10 relative"
          >
            <img src={img} className="w-full h-full object-cover" />
            {i === 0 && (
              <span className="absolute bottom-0 w-full text-xs bg-black/60 text-center">
                Thumbnail
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
