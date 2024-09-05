import Image from "next/image";
import Books from "./components/Books";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
      <section className="max-w-4xl w-full text-center">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">
          MongoDB CRUD Sample
        </h1>
        <Books />
      </section>
    </main>
  );
}
