import { useState, useEffect } from "react";
import CurrencyDropdown from "./Dropdown";
import { HiArrowsRightLeft } from "react-icons/hi2";

const CurrencyConverter = () => {
    const [currencies, setCurrencies] = useState([]);
    const [amount, setAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState("USD");
    const [toCurrency, settoCurrency] = useState("INR");
    const [convertedAmount, setConvertedAmount] = useState(null);
    const [converting, setConverting] = useState(false);
    const [favorites, setFavorites] = useState(
        JSON.parse(localStorage.getItem("favorites")) || ['INR', 'EUR']
    );

    const fetchCurrencies = async () => {
        try {
            const res = await fetch("https://api.frankfurter.app/currencies")
            const data = await res.json();

            setCurrencies(Object.keys(data))
        } catch (error) {
            console.log("Error fetching ", error);
        }
    };
1101
    useEffect(() => {
        fetchCurrencies();
    }, []);

    // console.log(currencies);

    const convertCurrency = async () => {
        if (!amount) return;


        try {
            const res = await fetch(
                `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
            )
            const data = await res.json();

            setConvertedAmount(data.rates[toCurrency] + " " + toCurrency);
        } catch (error) {
            console.log("Error fetching ", error);
        } finally { (setConverting(false)) }
    }

    const handleFavorite = (currency) => {
        let updatedFavorites =[...favorites]

        if(favorites.includes(currency)) {
            updatedFavorites = updatedFavorites.filter((fav)=> fav !== currency);
        } else {
            updatedFavorites.push(currency);
        }

        setFavorites(updatedFavorites)
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    };

    const swapCurrencies = () => {
        setFromCurrency(toCurrency)
        settoCurrency(fromCurrency)
    }

    return (
        <div className="max-w-xl mx-auto my-10 p-5 bg-white rounded-lg shadow-md">
            <h2 className="mb-5 text-2xl font-semibold text-gray-700">Currency Converter</h2>
            {/* Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <CurrencyDropdown
                    currencies={currencies}
                    currency={fromCurrency}
                    setCurrency={setFromCurrency}
                    favorites={favorites }
                    handleFavorite={handleFavorite}
                    title="From:"
                />

                <div className="flex justify-center -mb-5 sm:mb-0">
                    <button
                        onClick={swapCurrencies}
                        className="p-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 ">
                        <HiArrowsRightLeft />
                    </button>
                </div>

                <CurrencyDropdown
                    currencies={currencies}
                    currency={toCurrency}
                    setCurrency={settoCurrency}
                    favorites={favorites }
                    handleFavorite={handleFavorite}
                    title="To:"
                />
            </div>



            <div className="mt-4">
                <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-gray-700"
                >Amount:
                </label>
                <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                    className="w-full p-2 border gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 mt-1"
                />
            </div>

            <div className="flex justify-end mt-6">
                <button
                    onClick={convertCurrency}
                    className={`px-5 py-2 bg-indigo-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-1 focus:ring-offset-2 ${converting ? "animate-pulse" : ""}`}
                >
                    Convert
                </button>
            </div>
            {convertedAmount && <div className="mt-4 text-lg font-medium text-right text-green-600">
                Converted amount: {convertedAmount}
            </div>}

        </div>
    );
};

export default CurrencyConverter;
