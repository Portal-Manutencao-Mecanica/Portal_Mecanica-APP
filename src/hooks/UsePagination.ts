import { PaginationProps } from "@/props/PaginationProps";
const generatePages = (page : number, totalPages: number) =>{
    const current = Math.min(page, totalPages);
    const total = Math.max(1, totalPages)

    return Array.from({length : total}, (_,i) => i+1)
}

export const UsePagination = ({page, limit, total} : Omit<PaginationProps, "onPageChange">) => {
    const totalPages = Math.ceil(total/limit);
    const pages = generatePages(page, totalPages)

    const isCurrentPage = (n : number) => n === page;

    return {
        pages,
        totalPages,
        isCurrentPage
    }
}