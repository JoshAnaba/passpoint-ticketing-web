import React from 'react';

interface CurrencyFlagProps {
  currency: string;
  className?: string;
  fallbackColor?: string;
}

const CurrencyFlag: React.FC<CurrencyFlagProps> = ({ 
  currency, 
  className = "w-4 h-3 object-cover rounded-sm",
  fallbackColor = "bg-success"
}) => {
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  if (imageError) {
    return (
      <div 
        className={`${className} ${fallbackColor} flex items-center justify-center text-xs font-bold text-white`}
        title={`${currency} flag not available`}
      >
        {currency.slice(0, 2)}
      </div>
    );
  }

  return (
    <img 
      src={`https://asset.mypasspoint.com/img/payoutCurrency/${currency}.png`}
      alt={`${currency} flag`}
      className={className}
      onError={handleImageError}
    />
  );
};

export default CurrencyFlag;