export type DataTableColumn<T> = {
    key: string;
    header: string;
    render?: (row: T) => React.ReactNode;
    width?: string;
  };
  
  export type DataTableProps<T> = {
    caption?: string;
    ariaLabel?: string;
  
    columns: DataTableColumn<T>[];
    rows: T[];
  
    getRowId: (row: T) => string;
  
    emptyText?: string;
    onRowClick?: (row: T) => void;
  };
  