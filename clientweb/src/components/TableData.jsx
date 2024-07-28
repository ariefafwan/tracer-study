import { ButtonPrimary } from "./ButtonPrimary";

export const TableData = ({
    children,
    buttonModal,
    pagination,
    changePagination,
    inputsearch,
    changeSearch,
    head,
    label,
    filter,
}) => {
    return (
        <>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <caption className="p-5 font-semibold text-left rtl:text-right text-gray-900 bg-white">
                    <p
                        className={
                            (changeSearch != false && buttonModal != false
                                ? "mb-4"
                                : "") + " text-xl"
                        }
                    >
                        {label}
                    </p>
                    <div
                        className={
                            "flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 bg-white" +
                            (changeSearch != false && buttonModal != false
                                ? " pb-4"
                                : "")
                        }
                    >
                        {buttonModal !== false ? (
                            <ButtonPrimary eventFun={buttonModal}>
                                Tambah Data
                            </ButtonPrimary>
                        ) : (
                            ""
                        )}
                        <div
                            className={
                                (buttonModal !== false ? "" : "w-full") +
                                " flex justify-end h-full"
                            }
                        >
                            {filter !== false ? filter : ""}
                            {changeSearch == false ? (
                                ""
                            ) : (
                                <>
                                    <div className="relative">
                                        <select
                                            value={pagination}
                                            onChange={changePagination}
                                            className="h-full border block appearance-none w-full bg-white border-gray-300 text-gray-700 py-2 px-2 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        >
                                            <option value={10}>10</option>
                                            <option value={20}>20</option>
                                            <option value={50}>50</option>
                                        </select>
                                        <div className="pointer-events-none absolute top-3 right-0 flex items-center px-2 text-gray-700">
                                            <svg
                                                className="fill-current h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                            <svg
                                                className="w-4 h-4 text-gray-500 "
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                                />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            id="table-search-users"
                                            value={inputsearch}
                                            onChange={changeSearch}
                                            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 w-56 bg-gray-50 focus:outline-none"
                                            placeholder="Cari Data..."
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </caption>
                <thead className="text-xs text-black uppercase bg-teal-500">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            No.
                        </th>
                        {head.map((data, i) => {
                            return (
                                <th key={i} scope="col" className="px-6 py-3">
                                    {data}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>{children}</tbody>
            </table>
        </>
    );
};
