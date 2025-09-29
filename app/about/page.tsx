import Link from 'next/link'

export default function About() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <Link
          href="/"
          className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30"
        >
          ← Back to Home
        </Link>
      </div>

      <div className="relative flex place-items-center">
        <h1 className="text-4xl font-bold text-center">
          About Froebel Site
        </h1>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-1 lg:text-left">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            Next.js App Router
          </h2>
          <p className="m-0 max-w-[60ch] text-sm opacity-50">
            This project is built with Next.js 14 using the new App Router. The App Router provides a more intuitive file-system based routing system with support for layouts, loading states, error handling, and more.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            Serverless APIs
          </h2>
          <p className="m-0 max-w-[60ch] text-sm opacity-50">
            The project includes example serverless API routes that demonstrate how to create RESTful endpoints. These APIs are automatically deployed as serverless functions and can handle various HTTP methods.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            TypeScript Support
          </h2>
          <p className="m-0 max-w-[60ch] text-sm opacity-50">
            Full TypeScript support is configured out of the box, providing type safety and better developer experience throughout the application.
          </p>
        </div>
      </div>
    </main>
  )
}
