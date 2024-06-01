import { useEffect } from "react";

export const ButtonPagination = ({
    from,
    to,
    total,
    next_page_url,
    prev_page_url,
    nextPage,
    prevPage,
    children,
}) => {
    return (
        <nav
            className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4"
            aria-label="Table navigation"
        >
            <span className="text-sm font-normal text-gray-500 mb-4 md:mb-0 block w-full md:inline md:w-auto">
                Menampilkan&nbsp;
                <span className="font-semibold text-gray-900">
                    {from == null ? 0 : from} - {to == null ? 0 : to}
                </span>
                &nbsp;dari&nbsp;
                <span className="font-semibold text-gray-900">{total}</span>
                &nbsp;Data
            </span>
            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                <li>
                    <button
                        onClick={prevPage}
                        disabled={prev_page_url == null}
                        className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700"
                    >
                        Previous
                    </button>
                </li>
                {children}
                <li>
                    <button
                        onClick={nextPage}
                        disabled={next_page_url == null}
                        className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700"
                    >
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
};
