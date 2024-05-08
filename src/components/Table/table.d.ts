import { Column } from "react-table"
import { Cell, UserDefinedCell, resolveCell } from "./cell"
import { UserDefinedColumn } from "./column"
import { FileFormat, RawValueType } from "@common/types"

export interface FilterGroup {
    name: string // filter group name
    id:? string // optional: internal, unique id for filter group; if not provided will be generated from name
    info?: string // optional: descriptive text describing the filter group for info popup
    expand?: boolean // optional: expand by default, group collapsed if missing
}

export interface RowSelectOptions {
    onSelectFn: any // behavior on select
    selectType: 'highlight' | 'checkbox' // how row selection is indicated
    multiSelect?: boolean // optional: allow selection of multiple rows, false if missing
}

export interface TableProps {
    title?: string
    id?:string // optional: internal id for the table; if not provided will be generated from name
    info?: string // optional: descriptive text describing the table for info popup
    canFilter?: boolean // optional: table can be filtered; false if misssing
    filterGroups?: FilterGroup[] // optional: array filter groups for arranging columns in the advance filter interface
    export?: FileFormat[] // optional: enable exports in the listed file formats; exports disabled if missing
    rowSelect?: rowSelectOptions // optional: enables row selection and related state change options
}


type UserDefinedTableRow = Record<string, UserDefinedCell | UserDefinedCell[] >
type UserDefinedTableData = UserDefinedTableRow[]

// to satisfy type script --> what we expect from the user at a bare minimum
export interface UserDefinedTable {
    options?: Record<string, any>
    columns: Record<string, any>
    data: Record<string, any>[]
}

// FIXME: not sure if this intermediary is necessary
export interface UnresolvedTable {
    options: TableProps,
    columns: UserDefinedColumn,
    data: UserDefinedData
}

export type TableRow = Record<string, Cell | Cell[]>;
export type TableData = TableRow[]


// transform UserDefintedTableRows into TableRows
const resolveTableRow: TableRow = (userRow: UserDefinedTableRow, columns: Column[]) => {

}

// transform UserDefinedTableData into TableData
export const resolveTableData:TableData = (userData: UserDefinedTableData) => {
        // resolve columns
        // map over rows w/resolved columns and resolve row to assemble data
}
