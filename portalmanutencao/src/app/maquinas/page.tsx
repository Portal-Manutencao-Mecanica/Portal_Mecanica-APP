"use client";

import Pagination from "@/components/molecules/Pagination";
import { useState, useEffect } from "react";

export default function ListaDeProdutos() {
  const [page, setPage] = useState(1);
  const [allUsers, setAllUsers] = useState<any[]>([]); 
  const limit = 1; 

  
  useEffect(() => {
    fetch("http://localhost:8080/admin")
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar dados");
        return res.json();
      })
      .then((data) => setAllUsers(data))
      .catch((err) => console.error(err));
  }, []);

  
  const total = allUsers.length; 
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  
  const currentResults = allUsers.slice(startIndex, endIndex);

  return (
    <div>
      
      <ul>
        {currentResults.map((p: any) => (
          <li key={p.id}>{p.nome}</li>
        ))}
      </ul>

      
      {total > 0 && (
        <Pagination
          page={page}
          limit={limit}
          total={total}
          onPageChange={(newPage: number) => setPage(newPage)}
        />
      )}
    </div>
  );
}