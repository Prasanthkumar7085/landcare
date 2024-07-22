import dayjs from "dayjs";

export const datePipe = (data: any) => {

    const dateFormat = dayjs(data).format("MMMM D, YYYY h:mm A")
    return dateFormat;
};