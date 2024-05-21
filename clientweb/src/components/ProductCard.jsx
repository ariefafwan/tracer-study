export const ProductCard = ({ data, onClick }) => {
    const produk = data;
    const rupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };
    return (
        <>
            <div className="block rounded-lg shadow-xl">
                <img
                    alt=""
                    src={produk.gambar}
                    className="h-32 w-full rounded-t-md object-cover"
                />
                <div className="px-3 py-2">
                    <dl>
                        <div>
                            {produk.data_diskon !== null ? (
                                <dd className="text-xs font-bold text-black">
                                    <span className="line-through mr-1 text-gray-500">
                                        {rupiah(produk.harga)}
                                    </span>
                                    <span>
                                        {rupiah(
                                            produk.harga -
                                                produk.data_diskon
                                                    .potongan_harga
                                        )}
                                    </span>
                                </dd>
                            ) : (
                                <dd className="text-xs font-bold text-black">
                                    {rupiah(produk.harga)}
                                </dd>
                            )}
                        </div>
                        <div className="h-10 text-xs mt-1">
                            <dd className="font-medium text-xs line-clamp-2">
                                {produk.nama}
                            </dd>
                            <dt className="mt-1 text-gray-500 font-normal text-xs line-clamp-2">
                                Stok : {produk.stok}
                            </dt>
                        </div>
                    </dl>
                    <button
                        type="button"
                        onClick={onClick}
                        className="w-full inline-flex justify-center p-1 col-span-2 bg-yellow-400 text-black text-xs font-semibold rounded-sm"
                    >
                        Add To Cart
                    </button>
                </div>
            </div>
        </>
    );
};
