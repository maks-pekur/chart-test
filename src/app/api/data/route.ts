import { ICost, ICostMap, IUsage } from "@/types";
import csv from "csv-parser";
import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

const readCSV = async <T>(filePath: string): Promise<T[]> => {
  const rows: T[] = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => rows.push(data))
      .on("end", () => resolve(rows))
      .on("error", (error) => reject(error));
  });
};

export async function GET() {
  try {
    const usagesPath = path.join(process.cwd(), "public/data/usages.csv");
    const costsPath = path.join(process.cwd(), "public/data/costs.csv");

    const usages = await readCSV<IUsage>(usagesPath);
    const costs = await readCSV<ICost>(costsPath);

    const costsMap: ICostMap = costs.reduce<ICostMap>((acc, item) => {
      acc[item.model] = {
        input: parseFloat(item.input),
        output: parseFloat(item.output),
      };
      return acc;
    }, {});

    const processedData = usages.map((usage) => {
      const modelCosts = costsMap[usage.model];
      const totalCost =
        modelCosts.input * parseFloat(usage.usage_input) +
        modelCosts.output * parseFloat(usage.usage_output);

      return {
        ...usage,
        totalCost,
      };
    });

    return NextResponse.json(processedData);
  } catch (error) {
    console.error("Error reading CSV files:", error);
    return NextResponse.json(
      { error: "Failed to process CSV files" },
      { status: 500 }
    );
  }
}
