
//barcode number textfeild
export const checkBarCodeNumber = (event: any) => {
  const value = event.target.value.replace(/\D/g, "");
  event.target.value = value.slice(0, 8);
};

//zipcode number checking
export const checkZipCode = (event: any) => {
  const value = event.target.value.replace(/\D/g, "");
  event.target.value = value.slice(0, 5);
};

//check only alphabets and spaces allowed
export const checkAllowedAlphabets = (event: any) => {
  const inputValue = event.target.value;
  const regex = /^[a-zA-Z\s]*$/;

  if (regex.test(inputValue)) {
    return true;
  }
};
//check only alphabets and spaces allowed
export const checkAllowedValidText = (value: any) => {
  const inputValue = value;
  const regex = /\w+/;

  if (regex.test(inputValue)) {
    return true;
  }
};

