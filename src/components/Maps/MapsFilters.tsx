import { mapsFilterOptions } from "@/lib/constants/mapConstants";
import { getSingleMapDetailsAPI } from "@/services/maps";
import { Button, InputAdornment, Tab, Tabs, TextField } from "@mui/material";
import dayjs from "dayjs";
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
import AutoCompleteSearch from "../Core/AutoCompleteSearch";

const MapsFilters = ({ getAllMaps, mapsData, mapsCount }: any) => {
  const router = useRouter();
  const path = usePathname();
  const params = useSearchParams();
  const { id } = useParams();

  const [searchString, setSearchString] = useState(
    params.get("search_string") || ""
  );
  const [mount, setMount] = useState(false);
  const [fromDate, setFromDate] = useState<string | null>(
    params.get("from_date") || null
  );
  const [toDate, setToDate] = useState<string | null>(
    params.get("to_date") || null
  );
  const [status, setStatus] = useState<string | null>(
    params.get("status") || null
  );
  const sortFilter = mapsFilterOptions?.find(
    (item: any) =>
      item?.title &&
      item?.value == (params?.get("sort_type") && params?.get("sort_by"))
  );
  const [selecteValue, setSelectValue] = useState<any>(sortFilter || null);
  const [mapDetails, setMapDetails] = useState<any>({});
  const handleSearchChange = (event: any) => {
    const newSearchString = event.target.value;
    setSearchString(newSearchString);
  };

  const handleStatusChange = (
    event: React.SyntheticEvent,
    newValue: string
  ) => {
    setStatus(newValue);
    getAllMaps({
      status: newValue,
      page: 1,
    });
  };

  const handleSortFilter = (newValue: any) => {
    if (newValue) {
      setSelectValue(newValue);
      getAllMaps({
        sort_by: newValue?.value,
        sort_type: newValue?.title,
        page: 1,
      });
    } else {
      setSelectValue(null);
      getAllMaps({
        sort_by: "",
        sort_type: "",
        page: 1,
      });
    }
  };

  const formatDate = (date: any) => {
    if (!date) return null;
    const dateFormat = dayjs(date).format("YYYY-MM-DD");
    return dateFormat;
  };

  useEffect(() => {
    if (mount) {
      let debounce = setTimeout(() => {
        getAllMaps({
          search_string: searchString,
          page: 1,
        });
      }, 500);
      return () => clearInterval(debounce);
    } else {
      setMount(true);
      setSearchString((params.get("search_string") as string) || "");
      getAllMaps({});
    }
  }, [searchString]);

  const handleDateRangeChange = (range: any) => {
    if (range) {
      const [start, end] = range;
      setFromDate(formatDate(start));
      setToDate(formatDate(end));
      getAllMaps({
        from_date: formatDate(start) ? formatDate(start) : "",
        to_date: formatDate(end) ? formatDate(end) : "",
        page: 1,
      });
    } else {
      setFromDate(null);
      setToDate(null);

      getAllMaps({
        from_date: "",
        to_date: "",
        page: 1,
      });
    }
  };

  const getSingleMapDetails = async () => {
    try {
      const response = await getSingleMapDetailsAPI(id);
      if (response?.status == 200 || response?.status == 201) {
        setMapDetails(response?.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
    }
  };
  useEffect(() => {
    if (id) {
      getSingleMapDetails();
    }
  }, []);

  const getTextHtml = (text: string, count: number) => {
    return (
      <div>
        <span>{text}</span>
        <span className="count">{count}</span>
      </div>
    );
  };

  return (
    <>
      <div className="mapHeaderContainer">
        <Tabs
          className="tabsGrp"
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
          value={params.get("status") ? params.get("status") : ""}
          onChange={handleStatusChange}
        >
          <Tab
            className="tabBtn"
            value=""
            label={getTextHtml(
              "All",
              (+mapsCount["publish"] || 0) + (+mapsCount["draft"] || 0)
            )}
          ></Tab>
          <Tab
            className="tabBtn"
            value="draft"
            label={getTextHtml("draft", mapsCount["draft"] || 0)}
          />
          <Tab
            className="tabBtn"
            value="publish"
            label={getTextHtml("Published", mapsCount["publish"] || 0)}
          />
        </Tabs>
        <div className="filterGrp">
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
            defaultCalendarValue={[
              new Date("2024-07-01 00:00:00"),
              new Date("2024-08-01 23:59:59"),
            ]}
            placement="bottomEnd"
          />
          <AutoCompleteSearch
            data={mapsFilterOptions}
            setSelectValue={setSelectValue}
            selectedValue={selecteValue}
            placeholder="Sort Filter"
            onChange={handleSortFilter}
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
    </>
  );
};

export default MapsFilters;
