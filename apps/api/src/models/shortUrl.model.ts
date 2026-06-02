import mongoose, { Schema, type InferSchemaType } from "mongoose";

const shortUrlSchema = new Schema(
  {
    urlId: { type: String, required: true, unique: true, index: true },
    origUrl: { type: String, required: true },
    shortUrl: { type: String, required: true },
    clicks: { type: Number, required: true, default: 0 },
    date: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

shortUrlSchema.index({ origUrl: 1 });

export type ShortUrlDocument = InferSchemaType<typeof shortUrlSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const ShortUrlModel = mongoose.model("ShortUrl", shortUrlSchema);
