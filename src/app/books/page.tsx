import Link from "next/link"; // Para navegação
import Books from "@/app/components/Books";
import React from "react"; // Ajuste o caminho se necessário
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn'; // Ícone de voltar do Material-UI

const BooksPage: React.FC = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
      <section className="max-w-4xl w-full text-center">

        {/* Botão estilizado com ícone de voltar no topo */}
        <div className="w-full text-left mb-4">
          <Link href="/" className="inline-flex items-center text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-700">
            <AssignmentReturnIcon className="mr-2" />
            Voltar à Página Inicial
          </Link>
        </div>

        {/* Título */}
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">
          Lista de Livros
        </h1>

        {/* Componente Books */}
        <Books />
        
      </section>
    </main>
  );
};

export default BooksPage;
