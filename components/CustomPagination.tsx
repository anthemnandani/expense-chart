import { ChevronLeft, ChevronRight } from "lucide-react";

interface CustomPaginationProps {
    totalItems: number;
    rowsPerPage: number;
    setRowsPerPage: (rows: number) => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
    totalItems,
    rowsPerPage,
    setRowsPerPage,
    currentPage,
    setCurrentPage,
}) => {
    const totalPages = Math.ceil(totalItems / rowsPerPage);

    const handlePrev = () => setCurrentPage(Math.max(currentPage - 1, 1));
    const handleNext = () => setCurrentPage(Math.min(currentPage + 1, totalPages));

    const handleRowsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to first page when rows change
    };

    const from = (currentPage - 1) * rowsPerPage + 1;
    const to = Math.min(currentPage * rowsPerPage, totalItems);

    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 mt-4">
            {/* Rows Per Page */}
            <div className="flex items-center gap-2">
                <span className="text-sm">Rows per page:</span>
                <select
                    value={rowsPerPage}
                    onChange={handleRowsChange}
                    className="border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:ring-0 focus:border-blue-500"
                >
                    {[5, 10, 25, 50].map((val) => (
                        <option key={val} value={val}>
                            {val}
                        </option>
                    ))}
                </select>
            </div>

            {/* Current Range Display */}
            <div className="text-sm">
                {from}–{to} of {totalItems}
            </div>

            {/* Pagination Buttons */}
            <div className="flex gap-1">
                <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className={`p-2 rounded border ${currentPage === 1
                            ? "text-gray-400 border-gray-200"
                            : "hover:bg-blue-600 hover:text-white border-gray-300"
                        }`}
                >
                    <ChevronLeft />
                </button>
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded border ${currentPage === totalPages
                            ? "text-gray-400 border-gray-200"
                            : "hover:bg-blue-600 hover:text-white border-gray-300"
                        }`}
                >
                    <ChevronRight />
                </button>
            </div>
        </div>
    );
};

export default CustomPagination;