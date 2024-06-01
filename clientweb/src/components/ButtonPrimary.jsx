export const ButtonPrimary = ({ children, eventFun }) => {
    return (
        <button
            type="button"
            onClick={eventFun}
            className="text-black bg-teal-500 hover:bg-teal-600 focus:ring-4 focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 focus:outline-none"
        >
            {children}
        </button>
    );
};
