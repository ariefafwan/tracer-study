import { Helmet, HelmetProvider } from "react-helmet-async";

export const Head = ({ title }) => {
    return (
        <>
            <HelmetProvider>
                <div>
                    <Helmet>
                        <title>{title}</title>
                    </Helmet>
                </div>
            </HelmetProvider>
        </>
    );
};
