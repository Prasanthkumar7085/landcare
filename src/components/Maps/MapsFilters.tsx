import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";
import { InputAdornment, TextField } from "@mui/material";
import Image from "next/image";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const MapsFilters = () => {
    const router = useRouter();
    const path = usePathname();
    const params = useSearchParams();
    const param = useParams();

    const [searchString, setSearchString] = useState(params.get("search_string") || "");
    const [searchParams, setSearchParams] = useState(
        Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
    );

    const handleSearchChange = (event: any) => {
        const newSearchString = event.target.value;
        setSearchString(newSearchString);
        let queryParams = {
            ...searchParams,
            search_string: encodeURIComponent(newSearchString),
            page: 1
        }
        let queryString = prepareURLEncodedParams("", queryParams)
        router.push(`${path}${queryString}`);
    };

    useEffect(() => {
        setSearchParams(
            Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
        );
    }, [params]);

    return (
        <div style={{ display: 'flex', justifyContent: "flex-end" }}>
            <TextField
                variant="outlined"
                type="search"
                value={searchString}
                onChange={handleSearchChange}
                placeholder="Search Title"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Image src="/search-icon.svg" alt="" width={15} height={15} />
                        </InputAdornment>
                    ),
                }}
            />

        </div>
    );
}
export default MapsFilters;