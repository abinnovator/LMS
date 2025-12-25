import { cn } from "@/lib/utils";
import { CloudUploadIcon, ImageIcon, Loader2Icon, XIcon } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { progress } from "motion/react";

export const RenderState = ({ isDragActive }: { isDragActive: boolean }) => {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-4">
        <CloudUploadIcon
          className={cn(
            "size-6 text-muted-foreground",
            isDragActive && "text-primary"
          )}
        />
      </div>
      <p className="text-base font-semibold text-foreground">
        Drop your files here or{" "}
        <span className="text-primary font-bold cursor-pointer">
          Click to upload
        </span>
      </p>
      <Button className="mt-4" type="button">
        {" "}
        Select File
      </Button>
    </div>
  );
};

export const RenderErrorState = () => {
  return (
    <div className="text-destructive text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30 mb-5">
        <ImageIcon className={cn("size-6 text-destructive")} />
      </div>
      <p className="text-base font-semibold text-foreground">Upload Failed</p>
      <p className="text-xl mt-1">Something went wrong</p>
      <Button className="mt-4" type="button">
        Retry File Section
      </Button>
    </div>
  );
};

export const SuccessState = ({
  previewUrl,
  isDeleting,
  handleDelete,
}: {
  previewUrl: string;
  isDeleting: boolean;
  handleDelete: () => void;
}) => {
  return (
    <div className="">
      <Image src={previewUrl} alt="" fill className="object-contain p-2" />
      <Button
        variant="destructive"
        size="icon"
        className={cn("absolute top-4 right-4 cursor-pointer")}
        onClick={handleDelete}
        disabled={isDeleting}
        type="button"
      >
        {isDeleting ? (
          <Loader2Icon className="animate-spin size-4" />
        ) : (
          <XIcon />
        )}
      </Button>
    </div>
  );
};

export function RenderUploadingState({
  progress,
  file,
}: {
  progress: number;
  file: File;
}) {
  return (
    <div className="text-center flex justify-center items-center flex-col">
      <p>{progress}</p>
      <p className="mt-2 font-medium text-sm text-foreground">Uploading...</p>
      <p className="mt-1 text-xs text-muted-foreground truncate max-w-xs">
        {file.name}
      </p>
    </div>
  );
}
