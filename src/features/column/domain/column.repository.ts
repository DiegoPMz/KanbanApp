import { Result } from "@/shared/lib/result";
import { ColumnModel } from "./column.model";

export interface IColumnRepository {
	findById: (columnId: ColumnModel["id"]) => Promise<Result<ColumnModel>>;
	create: (data: ColumnModel) => Promise<Result<ColumnModel>>;
	update: (data: ColumnModel) => Promise<Result<ColumnModel>>;
	delete: (data: ColumnModel) => Promise<Result<string>>;
	reorder: (data: ColumnModel) => Promise<Result<ColumnModel[]>>;
}
