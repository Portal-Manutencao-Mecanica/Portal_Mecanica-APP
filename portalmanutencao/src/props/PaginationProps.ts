
export interface PaginationProps{
    page : number,
    limit : number,
    total : number,
    onPageChange : (page: number) => void
}