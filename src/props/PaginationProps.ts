export interface PaginationProps {
  page: number;
  totalPages: number;
  totalElements?: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}
