"use client"
import { UsePagination } from "@/hooks/UsePagination";
import { PaginationProps } from "@/props/PaginationProps";
import Image from "next/image";

export default function Pagination({page, limit, total, onPageChange} : PaginationProps){

    const {totalPages} = UsePagination({page, limit, total});

    return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "center" }}>
      {/* -5 Páginas  */}
      <button 
        onClick={() => onPageChange(Math.max(1, page - 5))} 
        disabled={page === 1}
        style={{ background: "none", border: "none", cursor: page === 1 ? "not-allowed" : "pointer" }}
      >
        <Image src="/chevrons-left.svg"
            alt="Primeira Página"
            width={10}
            height={10}
            style={{
            opacity: page === 1 ? 0.4 : 1
            }} 
        />
      </button>

      {/* Página Anterior ‹ */}
      <button 
        onClick={() => onPageChange(page - 1)} 
        disabled={page === 1}
        style={{ background: "none", border: "none", cursor: page === 1 ? "not-allowed" : "pointer" }}
      >
        <Image src="/chevron-left.svg"
            alt="Página Anterior"
            width={10}
            height={10}
            style={{
            opacity: page === 1 ? 0.4 : 1
            }}
        />
      </button>

      {/* Número da Página Atual */}
      <span style={{ fontSize: "14px", fontWeight: "bold", color: "#000", minWidth: "24px", textAlign: "center" }}>
        {page}
      </span>

      {/* Próxima Página  */}
      <button 
        onClick={() => onPageChange(page + 1)} 
        disabled={page === totalPages}
        style={{ 
          background: "none", 
          border: "none", 
          cursor: page === totalPages ? "not-allowed" : "pointer"
        }}
      >
        <Image 
            src="/chevron-right.svg" 
            alt="Próxima Página" 
            width={10} 
            height={10} 
            style={{
                opacity: page === totalPages ? 0.4 : 1,
            }}
        />
      </button>

      {/* +5 Páginas  */}
      <button 
        onClick={() => onPageChange(Math.min(totalPages, page + 5))}
        disabled={page === totalPages}
        style={{ 
            background: "none", 
            border: "none", 
            cursor: page === totalPages ? "not-allowed" : "pointer"
            
        }}
      >
        <Image 
            src="/chevrons-right.svg" 
            alt="Última Página" 
            width={10} 
            height={10}
            style={{
                opacity: page === totalPages ? 0.4 : 1,
            }} 
        />
      </button>
    </div>
  );
}