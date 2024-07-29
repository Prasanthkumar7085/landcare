import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";
import { Button, InputAdornment, Tab, Tabs, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Image from "next/image";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite.css";
import dayjs from "dayjs";

const MapsFilters = ({ getAllMaps, mapsData }: any) => {
  const router = useRouter();
  const path = usePathname();
  const params = useSearchParams();
  const param = useParams();

  const [searchString, setSearchString] = useState(
    params.get("search_string") || ""
  );
  const [fromDate, setFromDate] = useState<string | null>(
    params.get("from_date") || null
  );
  const [toDate, setToDate] = useState<string | null>(
    params.get("to_date") || null
  );
  const [status, setStatus] = useState<string | null>(
    params.get("status") || null
  );
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
  );

  const handleSearchChange = (event: any) => {
    const newSearchString = event.target.value;
    setSearchString(newSearchString);
    getAllMaps({
      ...searchParams,
      search_string: encodeURIComponent(newSearchString),
      page: 1,
    });
  };

  const handleStatusChange = (event: React.SyntheticEvent, newValue: string) => {
    setStatus(newValue);
    getAllMaps({
      ...searchParams,
      status: encodeURIComponent(newValue),
      page: 1,
    });
  };

  const formatDate = (date: any) => {
    if (!date) return null;
    const dateFormat = dayjs(date).format("YYYY-MM-DD");
    return dateFormat;
  };

  const handleDateRangeChange = (range: any) => {
    if (range) {
      const [start, end] = range;
      setFromDate(formatDate(start));
      setToDate(formatDate(end));
      getAllMaps({
        ...searchParams,
        from_date: formatDate(start) ? formatDate(start) : "",
        to_date: formatDate(end) ? formatDate(end) : "",
        page: 1,
      });
    } else {
      setFromDate(null);
      setToDate(null);

      getAllMaps({
        ...searchParams,
        from_date: "",
        to_date: "",
        page: 1,
      });
    }
  };

  useEffect(() => {
    setSearchParams(
      Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
    );
  }, [params]);

  return (
    <div className="mapHeaderContainer">
      <Tabs
        className="tabsGrp"
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="secondary tabs example"
        value={searchParams?.status ? searchParams?.status : ""}
        onChange={handleStatusChange}
      >
        <Tab className="tabBtn" value="" label="All" />
        <Tab className="tabBtn" value="draft" label="Draft" />
        <Tab className="tabBtn" value="publish" label="Published" />
      </Tabs>
      <div className="filterGrp">
        <DateRangePicker
          className="defaultDatePicker"
          value={
            fromDate && toDate ? [new Date(fromDate), new Date(toDate)] : null
          }
          editable={false}
          onChange={handleDateRangeChange}
          placeholder="Start Date - End Date"
          style={{ width: 250 }}
          disabledDate={(date) => {
            return date.getTime() >= new Date().getTime();
          }}
          placement="bottomEnd"
        />
        <TextField
          className="defaultTextFeild"
          variant="outlined"
          type="search"
          size="small"
          value={searchString}
          onChange={handleSearchChange}
          placeholder="Search"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Image src="/search-icon.svg" alt="" width={15} height={15} />
              </InputAdornment>
            ),
          }}
        />
        <Button
          className="addNewBtn"
          variant="contained"
          onClick={() => {
            router.push("/add-map");
          }}
          endIcon={
            <Image src="/map/add-icon.svg" alt="" height={13} width={13} />
          }
        >
          Create New Map
        </Button>
      </div>
    </div>
  );
};

export default MapsFilters;
