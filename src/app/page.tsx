"use client";

import { useEffect, useState } from "react";

import Chart from "@/components/chart";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { Filters } from "@/components/filters";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IChartDataItem, IDataItem, IFilterOptions, IFilters } from "@/types";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";

const Home = () => {
  const [data, setData] = useState<IDataItem[]>([]);
  const [filteredData, setFilteredData] = useState<IChartDataItem[]>([]);
  const [filters, setFilters] = useState<IFilters>({
    type: "all",
    model: "all",
  });
  const [filterOptions, setFilterOptions] = useState<IFilterOptions>({
    types: [],
    models: [],
  });
  const [totalRevenue, setTotalRevenue] = useState<number>(0);

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: addDays(new Date(2024, 0, 1), 7),
  });

  const normalizeDateRange = (
    range: DateRange | undefined
  ): { from: Date; to: Date } | undefined => {
    if (range?.from && range?.to) {
      return { from: range.from, to: range.to };
    }
    return undefined;
  };

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/data");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result: IDataItem[] = await response.json();
        
        const sortedData = result.sort((a, b) => {
          const dateA = new Date(a.created_at.split(".").reverse().join("-")); // Преобразование "DD.MM.YYYY" в "YYYY-MM-DD"
          const dateB = new Date(b.created_at.split(".").reverse().join("-"));
          return dateA.getTime() - dateB.getTime();
        });
        console.log("result", sortedData);

        setData(sortedData);
        setFilteredData(result);

        const types = Array.from(new Set(result.map((item) => item.type)));
        const models = Array.from(new Set(result.map((item) => item.model)));
        setFilterOptions({ types, models });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = data;

      const normalizedRange = normalizeDateRange(dateRange);

      if (normalizedRange) {
        filtered = filtered.filter((item) => {
          const itemDate = new Date(item.created_at);
          return (
            itemDate >= normalizedRange.from && itemDate <= normalizedRange.to
          );
        });
      }

      if (filters.type !== "all") {
        filtered = filtered.filter((item) => item.type === filters.type);
      }

      if (filters.model !== "all") {
        filtered = filtered.filter((item) => item.model === filters.model);
      }

      setFilteredData(filtered);

      const revenue = filtered.reduce((sum, item) => {
        const cost = typeof item.totalCost === "number" ? item.totalCost : 0;
        return sum + cost;
      }, 0);

      setTotalRevenue(revenue);
    };

    applyFilters();
  }, [filters, data, dateRange]);

  return (
    <div className="flex-col md:flex">
      <div className="flex-1 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4 p-6">
          <h1 className="mb-6 md:mb-0 text-2xl font-bold">Dashboard</h1>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <Filters
              types={filterOptions.types}
              models={filterOptions.models}
              onFilterChange={setFilters}
            />
            <CalendarDateRangePicker
              value={dateRange}
              onDateChange={handleDateChange}
            />
          </div>
          <ThemeToggle />
        </div>

        <Tabs defaultValue="overview" className="px-6">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" disabled>
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex justify-between">
                  <CardTitle>Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    ${totalRevenue.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </div>

            {filteredData.length > 0 ? (
              <Card>
                <CardContent>
                  <Chart
                    data={filteredData}
                    dateRange={normalizeDateRange(dateRange)}
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="flex items-center justify-center h-full w-full">
                <Loader />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Home;
