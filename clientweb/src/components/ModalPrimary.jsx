import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { useState } from "react";

export const ModalPrimary = ({
    submitAction,
    open,
    closeModal,
    header,
    children,
}) => {
    return (
        <>
            <Modal
                closeOnEsc={false}
                closeOnOverlayClick={false}
                showCloseIcon={false}
                open={open}
                onClose={closeModal}
                classNames={{
                    modal: "customModal",
                }}
            >
                <div className="relative min-w-2xl w-full max-w-3xl">
                    {/* Modal header */}
                    <div className="flex items-center justify-between py-3 border-b border-b-gray-500 rounded-t">
                        <h3 className="text-xl font-semibold text-gray-900">
                            {header}
                        </h3>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="text-black bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                        >
                            <svg
                                className="w-3 h-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <form onSubmit={submitAction}>
                        {/* Modal body */}
                        <div className="px-2 py-5 space-y-4">{children}</div>
                        {/* Modal footer */}
                        <div className="flex justify-end py-3 border-t border-t-gray-500 rounded-b">
                            <button
                                type="submit"
                                className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="py-2.5 px-5 ms-3 text-sm font-medium text-white focus:outline-none bg-red-500 rounded-lg hover:bg-red-600 focus:z-10"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
};
