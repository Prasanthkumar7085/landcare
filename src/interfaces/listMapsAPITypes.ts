export interface ListMapsApiProps {
    page: string | number;
    limit: string | number;
    search_string: string;
    status: string;
    from_date: string;
    to_date: string;
    sort_by: string;
    sort_type: string
}