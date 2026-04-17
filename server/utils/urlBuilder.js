import cloudinary from "../config/cloudinary.js";

export const buildMediaUrls = (public_id, type) => {
  if (type === "image") {
    return {
      original: cloudinary.url(public_id, {
        resource_type: "image",
        quality: "auto",
        fetch_format: "auto",
      }),

      thumbnail: cloudinary.url(public_id, {
        resource_type: "image",
        width: 300,
        height: 300,
        crop: "fill",
        quality: "auto",
      }),

      responsive: {
        mobile: cloudinary.url(public_id, {
          width: 480,
          crop: "limit",
          quality: "auto",
          fetch_format: "auto",
        }),
        desktop: cloudinary.url(public_id, {
          width: 1024,
          crop: "limit",
          quality: "auto",
          fetch_format: "auto",
        }),
      },
    };
  }

  // 🎬 VIDEO CONFIG
  return {
    video: {
      mobile: cloudinary.url(public_id, {
        resource_type: "video",
        width: 640,
        quality: "auto:low",
        format: "mp4",
      }),

      desktop: cloudinary.url(public_id, {
        resource_type: "video",
        width: 1280,
        quality: "auto",
        format: "mp4",
      }),
    },

    // 🔥 AUTO BEST THUMBNAIL
    poster: cloudinary.url(public_id, {
      resource_type: "video",
      format: "jpg",
      start_offset: "auto", // 🔥 best frame
      gravity: "auto",
      width: 1280,
      crop: "fill",
      quality: "auto",
    }),

    // ⚡ blur placeholder
    blurPoster: cloudinary.url(public_id, {
      resource_type: "video",
      format: "jpg",
      width: 20,
      quality: 10,
    }),
  };
};
