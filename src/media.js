// src/data/media.js
import result_image from "./media/smt_picture.png";
import result_video from "./media/test_smt_video-h264-cropped.mp4";
export const media = {
  videos: [
    {
      id: 1,
      title: "First Failure",
      src: result_video,
      type: "video",
    },
    {
      id: 2,
      title: "Second Failure",
      src: result_video,
      type: "video",
    },
    // Add more video objects as needed
  ],
  images: [
    {
      id: 1,
      title: "Second Failure",
      src: result_image,
      type: "image",
    },
    {
      id: 2,
      title: "Sample Image 2",
      src: result_image,
      type: "image",
    },
    {
      id: 3,
      title: "Sample Image 3",
      src: result_image,
      type: "image",
    },
    {
      id: 4,
      title: "Sample Image 4",
      src: result_image,
      type: "image",
    },
  ],
};
