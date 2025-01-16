import React, { useCallback, useReducer } from "react";
import { ImageIcon, XCircle } from "lucide-react";
import Cropper from "react-easy-crop";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Helper function to crop the image
const getCroppedImg = async (
  imageSrc: string,
  croppedAreaPixels: { x: number; y: number; width: number; height: number },
  zoom: number,
  crop: { x: number; y: number }
): Promise<string | null> => {
  const image = new Image();
  image.src = imageSrc;

  // Wait for the image to load
  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  // Adjust the canvas size to the cropped area's dimensions
  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;

  // Adjust the position and size of the source image to account for zoom
  ctx.drawImage(
    image,
    croppedAreaPixels.x / zoom, // Adjust x by zoom
    croppedAreaPixels.y / zoom, // Adjust y by zoom
    image.width, // Adjust width by zoom
    image.height, // Adjust height by zoom
    0, // Destination X on canvas
    0, // Destination Y on canvas
    croppedAreaPixels.width, // Final cropped width
    croppedAreaPixels.height // Final cropped height
  );

  // Return a base64 encoded image URL
  return new Promise<string>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }
      const croppedImageURL = URL.createObjectURL(blob);
      resolve(croppedImageURL);
    }, "image/jpeg");
  });
};

type DropzoneProps = {
  files: FileList | null;
  setFiles: React.Dispatch<React.SetStateAction<FileList | null>>;
};

type State = {
  imageSrc: string | null;
  croppedArea: { x: number; y: number; width: number; height: number } | null;
  crop: { x: number; y: number };
  zoom: number;
  showCropper: boolean;
};

type Action =
  | { type: "SET_IMAGE_SRC"; payload: string }
  | { type: "SET_CROP"; payload: { x: number; y: number } }
  | { type: "SET_ZOOM"; payload: number }
  | { type: "SET_CROPPED_AREA"; payload: { x: number; y: number; width: number; height: number } }
  | { type: "RESET" }
  | { type: "SHOW_CROPPER"; payload: boolean };

const initialState: State = {
  imageSrc: null,
  croppedArea: null,
  crop: { x: 0, y: 0 },
  zoom: 1,
  showCropper: false,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_IMAGE_SRC":
      return { ...state, imageSrc: action.payload, showCropper: true };
    case "SET_CROP":
      return { ...state, crop: action.payload };
    case "SET_ZOOM":
      return { ...state, zoom: action.payload };
    case "SET_CROPPED_AREA":
      return { ...state, croppedArea: action.payload };
    case "SHOW_CROPPER":
      return { ...state, showCropper: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

const CustomDropzone: React.FC<DropzoneProps> = ({ files, setFiles }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (files) {
        setFiles(files);
        const firstImage = files[0];

        if (firstImage) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const src = e.target?.result as string;
            dispatch({ type: "SET_IMAGE_SRC", payload: src });
          };
          reader.readAsDataURL(firstImage);
        }
      }
    },
    [setFiles]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      handleFiles(event.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    handleFiles(files);
  };

  const removeFiles = () => {
    dispatch({ type: "RESET" });
    setFiles(null);
  };

  const onCropComplete = useCallback((croppedAreaPixels: { x: number; y: number; width: number; height: number }) => {
    dispatch({ type: "SET_CROPPED_AREA", payload: croppedAreaPixels });
  }, []);

  const saveCroppedImage = async () => {
    if (state.imageSrc && state.croppedArea) {
      const croppedImageUrl = await getCroppedImg(state.imageSrc, state.croppedArea, state.zoom, state.crop);
      dispatch({ type: "SET_IMAGE_SRC", payload: croppedImageUrl ?? state.imageSrc });
    }
    dispatch({ type: "SHOW_CROPPER", payload: false });
  };

  return (
    <div
      className={cn(
        "border border-dashed",
        state.imageSrc ? "p-1" : "p-4",
        "bg-muted/50 flex items-center justify-center flex-col gap-2 rounded-lg relative transition-all duration-200 ease-in-out"
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {state.imageSrc ? (
        <>
          {state.showCropper ? (
            <>
              <div className="relative w-full h-64">
                <Cropper
                  image={state.imageSrc}
                  crop={state.crop}
                  zoom={state.zoom}
                  aspect={1}
                  onCropChange={(crop) => dispatch({ type: "SET_CROP", payload: crop })}
                  onZoomChange={(zoom) => dispatch({ type: "SET_ZOOM", payload: zoom })}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="flex justify-between mt-2">
                <Button variant="default" type="button" onClick={saveCroppedImage}>
                  Save Crop
                </Button>

                <Button variant="secondary" onClick={removeFiles}>
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <img src={state.imageSrc} alt="Cropped Image" className="rounded-md shadow-sm" style={{ maxWidth: "100%", maxHeight: "100%" }} />
              <XCircle className="absolute top-2 right-2 text-destructive hover:scale-105 active:scale-95 cursor-pointer" onClick={removeFiles} />
            </>
          )}
        </>
      ) : (
        <>
          <ImageIcon className="w-12 h-12" />
          <p className="text-muted-foreground text-sm">Drag and drop images here</p>
          <input type="file" onChange={handleFileInput} required className="absolute top-0 bottom-0 left-0 right-0 opacity-0 cursor-pointer" />
        </>
      )}
    </div>
  );
};

export default CustomDropzone;
