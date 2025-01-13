export const formatCurrency = (amount: number): string => {
    try {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch (error) {
      console.error("Error formatting currency:", error);
      return "Invalid Amount";
    }
  };
  
  export const formatNumber = (number: number): string => {
    try {
      return new Intl.NumberFormat('vi-VN').format(number);
    } catch (error) {
      console.error("Error formatting number:", error);
        return "Invalid Number";
    }
  };
  
  export const formatDate = (date: Date | string): string => {
      try {
        const parsedDate = typeof date === 'string' ? new Date(date) : date;
        return new Intl.DateTimeFormat('vi-VN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }).format(parsedDate);
      } catch (error) {
        console.error("Error formatting date:", error);
        return "Invalid Date";
      }
    };
  
  export const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{4})(\d{3})(\d{3})$/);
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]}`;
    }
    return phone;
  };