import Link from "next/link";

const HomePage: React.FC = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
      <section className="max-w-4xl w-full text-center">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">
          MongoDB CRUD Sample
        </h1>
        <p className="text-lg mb-4">Bem-vindo à página inicial!</p>
        <nav>
          <ul>
            <li>
              <Link href="/books" className="text-blue-500 hover:underline">
                Ir para Livros
              </Link>
            </li>
          </ul>
        </nav>
      </section>
    </main>
  );
};

export default HomePage;
