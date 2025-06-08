const gTTS = require("gtts");
const { Readable } = require("stream");
const cloudinary = require("../config/cloudinaryConfig");

const uploadVoiceToCloudinary = (text) => {
  return new Promise((resolve, reject) => {
    try {
      const gtts = new gTTS(text, "en");

      let audioBuffer = [];

      const audioStream = gtts.stream();

      audioStream.on("data", (chunk) => {
        audioBuffer.push(chunk);
      });

      audioStream.on("end", async () => {
        const buffer = Buffer.concat(audioBuffer);
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);

        const cloudinaryStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "video",
            folder: "med_VQA_Data/voice-responses",
            format: "mp3",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          }
        );

        stream.pipe(cloudinaryStream);
      });

      audioStream.on("error", (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = uploadVoiceToCloudinary;
