import mongoose, { Schema, type InferSchemaType } from "mongoose";

const clickEventSchema = new Schema(
  {
    urlId: { type: String, required: true, index: true },
    shortUrlRef: {
      type: Schema.Types.ObjectId,
      ref: "ShortUrl",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },
    clickedAt: { type: Date, default: Date.now, index: true },
    ip: { type: String, required: true },
    country: { type: String, default: null },
    referrer: { type: String, default: null },
    userAgent: { type: String, required: true },
    browser: { type: String, default: null },
    device: { type: String, default: null },
    os: { type: String, default: null },
  },
  { timestamps: false }
);

clickEventSchema.index({ urlId: 1, clickedAt: -1 });

export type ClickEventDocument = InferSchemaType<typeof clickEventSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const ClickEventModel = mongoose.model("ClickEvent", clickEventSchema);
