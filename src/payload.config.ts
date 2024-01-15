import { webpackBundler } from "@payloadcms/bundler-webpack";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { slateEditor } from "@payloadcms/richtext-slate";
import path from "path";
import { buildConfig } from "payload/config";
import { Users } from "./collections/Users";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
  collections: [Users],
  routes: {
    admin: "/sell",
  },
  admin: {
    user: "users",
    bundler: webpackBundler(),
    meta: {
      titleSuffix: "Jenny's Treasure Emporium",
      favicon: "/favicon.ico",
      ogImage: "/thumbnail.png",
    },
  },
  rateLimit: {
    max: 2000, // default is 500, for development this is better
  },
  editor: slateEditor({}), // slate or lexical editor, maybe checkout lexical in the future
  db: mongooseAdapter({ url: process.env.MONGODB_URL! }),
  typescript: {
    outputFile: path.resolve(__dirname, "payloadTypes.ts"),
  },
});
