export const CartProduct = ({ children, data }) => {
    const keranjang = data;
    const rupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };
    return (
        <>
            <div className="flex items-center gap-2">
                <img
                    src={keranjang.gambar}
                    alt=""
                    className="size-16 w-12 h-12 rounded-xl object-cover"
                />
                <div>
                    <h3 className="text-xs font-bold text-gray-900">
                        {keranjang.nama}
                    </h3>
                    <dl className="mt-0.5 font-semibold space-y-px text-xs text-gray-600">
                        <div>
                            <dt className="inline">
                                {rupiah(keranjang.harga)}
                            </dt>
                        </div>
                    </dl>
                </div>
                {children}
            </div>
        </>
    );
};
