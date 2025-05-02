import { Button } from "@/components/ui/button";

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  label?: string;
}

export const PaginationBar: React.FC<PaginationBarProps> = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  label = "elementos",
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-6 px-4 py-4 bg-white shadow-md rounded-xl border border-gray-200">
      {/* Paginación */}
      <div className="flex flex-wrap items-center  w-full justify-center sm:justify-between">
        <Button
          variant="outline"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-2 px-5 py-2 rounded-md font-medium text-sm transition-colors hover:bg-gray-100 disabled:opacity-50"
        >
          ⬅
        </Button>

        <span className="font-medium text-base text-gray-700">
          Página <span className="text-blue-600">{currentPage}</span> de{" "}
          <span className="text-blue-600">{totalPages}</span>
        </span>

        <Button
          variant="outline"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2 px-5 py-2 rounded-md font-medium text-sm transition-colors hover:bg-gray-100 disabled:opacity-50"
        >
          ➡
        </Button>
      </div>
      {/* Total */}
      <div className="flex items-center space-x-2">
        <h3 className="text-base font-medium text-gray-700">
          Total de {label}:
        </h3>
        <span className="text-xl font-bold text-blue-600">{totalItems}</span>
      </div>
    </div>
  );
};
