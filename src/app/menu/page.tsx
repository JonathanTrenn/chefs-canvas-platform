import { client } from "../../sanity/client";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const dishes = await client.fetch(`
    *[_type == "dish"] {
      _id,
      title,
      price,
      description,
      "imageUrl": image.asset->url
    }
  `);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-black text-white">
      
      {/* HEADER / LOGO AREA */}
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          CHEF'S CANVAS STUDIO
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://sanity.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by Sanity
          </a>
        </div>
      </div>

      {/* CENTER HERO TITLE */}
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-to-br before:from-transparent before:to-blue-700 before:opacity-10 before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-to-t after:from-sky-900 after:via-sky-900 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <h1 className="text-5xl font-bold">The Menu</h1>
      </div>

      {/* GRID OF DISHES */}
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-2 lg:text-left gap-8 mt-12">
        
        {dishes.map((dish: any) => (
          <div
            key={dish._id}
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
            {dish.imageUrl && (
              <img 
                src={dish.imageUrl} 
                alt={dish.title}
                className="w-full h-48 object-cover rounded-lg mb-4 opacity-80 group-hover:opacity-100 transition-opacity" 
              />
            )}

            <h2 className={`mb-3 text-2xl font-semibold`}>
              {dish.title}{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            
            <p className="text-xl font-bold mb-2 text-gray-400">
                ${dish.price}
            </p>

            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              {dish.description}
            </p>
          </div>
        ))}

        {dishes.length === 0 && (
            <p>Loading dishes...</p>
        )}

      </div>
    </main>
  );
}