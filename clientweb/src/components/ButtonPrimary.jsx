export const ButtonPrimary = ({ children, eventFun }) => {
    return (
        <button
            type="button"
            onClick={eventFun}
            className="text-black bg-cyan-500 hover:bg-cyan-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2focus:outline-none"
        >
            {children}
        </button>
    );
};
