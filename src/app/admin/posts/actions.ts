"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";

export async function createPost(formData: FormData) {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const categoryId = formData.get("categoryId") as string;
  const featuredImage = formData.get("featuredImage") as string;
  const published = formData.get("published") === "on";
  
  const rawTags = formData.get("tags") as string;
  const tags = rawTags.split(",").map(t => t.trim()).filter(Boolean);

  let slug = slugify(title, { lower: true, strict: true });
  
  // ensure slug uniqueness
  let existingPost = await prisma.post.findUnique({ where: { slug } });
  if (existingPost) {
    slug = `${slug}-${Date.now()}`;
  }

  // Handle Tags
  const tagConnectOrCreate = tags.map(tag => ({
    where: { slug: slugify(tag, { lower: true, strict: true }) },
    create: {
      name: tag,
      slug: slugify(tag, { lower: true, strict: true })
    }
  }));

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      content,
      excerpt,
      featuredImage: featuredImage || null,
      published,
      authorId: (session.user as any).id,
      categoryId: categoryId || null,
      tags: {
        connectOrCreate: tagConnectOrCreate,
      }
    }
  });

  revalidatePath("/admin/posts");
  return { success: true, postId: post.id };
}

export async function updatePost(postId: string, formData: FormData) {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const categoryId = formData.get("categoryId") as string;
  const featuredImage = formData.get("featuredImage") as string;
  const published = formData.get("published") === "on";
  
  const rawTags = formData.get("tags") as string;
  const tags = rawTags.split(",").map(t => t.trim()).filter(Boolean);

  // Handle Tags
  const tagConnectOrCreate = tags.map(tag => ({
    where: { slug: slugify(tag, { lower: true, strict: true }) },
    create: {
      name: tag,
      slug: slugify(tag, { lower: true, strict: true })
    }
  }));

  const post = await prisma.post.update({
    where: { id: postId },
    data: {
      title,
      content,
      excerpt,
      featuredImage: featuredImage || null,
      published,
      categoryId: categoryId || null,
      tags: {
        set: [], // clear existing tags
        connectOrCreate: tagConnectOrCreate,
      }
    }
  });

  revalidatePath("/admin/posts");
  revalidatePath(`/blog/${post.slug}`);
  return { success: true };
}

export async function deletePost(formData: FormData) {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.post.delete({
    where: { id }
  });

  revalidatePath("/admin/posts");
  revalidatePath("/blog");
}

export async function togglePostPublish(postId: string, published: boolean) {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  await prisma.post.update({
    where: { id: postId },
    data: { published },
  });

  revalidatePath("/admin/posts");
  revalidatePath("/blog");
}
