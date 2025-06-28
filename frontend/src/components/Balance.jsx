export const Balance = ({ value }) => {
  const amount = Number(value);

  return (
    <div className="flex items-center mb-4">
      <div className="font-bold text-lg">Your balance:</div>
      <div className="font-semibold ml-2 text-lg text-green-600">
        ₹ {isNaN(amount) ? "0.00" : amount.toFixed(2)}
      </div>
    </div>
  );
};
