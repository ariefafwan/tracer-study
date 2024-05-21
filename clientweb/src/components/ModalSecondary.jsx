import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

export const ModalSecondary = ({ open, closeModal, header, children }) => {
    return (
        <>
            <Modal
                closeOnEsc={true}
                closeOnOverlayClick={true}
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
                    <div className="px-2 py-5 space-y-4">{children}</div>
                </div>
            </Modal>
        </>
    );
};
