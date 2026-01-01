"use client";

import { FormEvent, useState } from "react";
import EventTitle from "./event-title";
import EventNotice from "./event-notice";
import EventSearchBar from "./event-search-bar";
import EventFilter from "./event-filter";
import EventNoData from "./event-no-data";
import EventListText from "./event-list-text";
import EventListImage from "./event-list-image";
import EventListCard from "./event-list-card";

export default function EventList({ events }: { events: any[] }) {
  const [inputValue, setInputValue] = useState("");
  const [keyword, setKeyword] = useState("");
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [region, setRegion] = useState<string>("");
  const [showFilter, setShowFilter] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "text" | "image">("card");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setKeyword(inputValue.trim());
  };

  const filtered = events.filter((ev) => {
    const matchKeyword = ev.name.toLowerCase().includes(keyword.toLowerCase());
    const matchYear = year ? ev.year === year : true;
    const matchMonth = month ? ev.month === month : true;
    const matchRegion = region ? ev.region === region : true;
    return matchKeyword && matchYear && matchMonth && matchRegion;
  });
  return (
    <>
      {/* 제목 */}
      <EventTitle />

      {/* 필터 */}
      <EventFilter
        showFilter={showFilter}
        onToggleFilter={() => setShowFilter((prev) => !prev)}
        year={year}
        month={month}
        region={region}
        onYearChange={setYear}
        onMonthChange={setMonth}
        onRegionChange={setRegion}
      />

      {/* 개수 표시 */}
      <EventNotice count={filtered.length} />

      {/* 검색 및 셀렉터 */}
      <EventSearchBar
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSubmit={handleSubmit}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* 리스트 렌더링 */}
      {filtered.length === 0 ? (
        <EventNoData />
      ) : (
        <>
          {viewMode === "card" && <EventListCard events={filtered} />}
          {viewMode === "text" && <EventListText events={filtered} />}
          {viewMode === "image" && <EventListImage events={filtered} />}
        </>
      )}
    </>
  );
}
