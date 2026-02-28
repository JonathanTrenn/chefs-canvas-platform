import { notFound } from "next/navigation";
import { client } from "../sanity/client";
import DishTemplate from "./components/DishTemplate";

export default async function HomePage() {
  const query = `
    *[_type == "dish"][0]{
      title,
      description,
      story,
      features,
      quoteText,
      quoteSource
    }
  `;

  const dish = await client.fetch(query);

  if (!dish) {
    notFound();
  }

  return (
    <DishTemplate
      title={dish.title ?? ""}
      subtitle={dish.description ?? ""}
      story={dish.story}
      features={dish.features}
      quoteText={dish.quoteText}
      quoteSource={dish.quoteSource}
    />
  );
}