"use server";

import { client } from "../lib/db";
import { redirect } from "next/navigation";

export async function createBook(formData) {
  const { title, rating, author, blurb } = Object.fromEntries(formData);

  // create book id (in a real application UUID would be better)
  const id = Math.floor(Math.random() * 100_000);

  console.log(`Sending book ${id} to redis`)

  // add book to sorted set
  const unique = await client.zAdd('books', {value: title, score: id}, {NX: true})

  if (!unique) {
    return {error: "Book have already been added"}
  }

  // save book as redis hash
  await client.hSet(`books:${id}`, {
    title,
    rating,
    author,
    blurb,
  });

  console.log("Done sending to redis")

  // redirect doesn't work right now
  redirect("/");
}
