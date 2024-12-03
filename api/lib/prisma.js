/*import { PrismaClient } from "@prisma/client";
import { getPosts } from "../controllers/post.controller.js";
import { router } from "../routes/post.route.js";

const prisma = new PrismaClient();
router.get("/", getPosts);

export default prisma;
*/

// lib/prisma.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
