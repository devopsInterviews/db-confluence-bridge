import React from 'react';
import { Table, CheckCircle, AlertCircle, Database, FileText, ChevronRight } from 'lucide-react';
import { SyncResult } from './DatabaseSyncTool';

interface ResultsTableProps {
  results: SyncResult[];
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  const totalTables = results.length;
  const tablesWithNewColumns = results.filter(r => r.newColumns && r.newColumns.length > 0).length;
  const tablesWithErrors = results.filter(r => r.error).length;
  const totalNewColumns = results.reduce((acc, r) => acc + (r.newColumns?.length || 0), 0);

  return (
    <div className="space-y-6 slide-in-up">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Database className="w-6 h-6 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">{totalTables}</div>
          <div className="text-sm text-muted-foreground">Total Tables</div>
        </div>

        <div className="glass-card rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-success" />
          </div>
          <div className="text-2xl font-bold text-success">{tablesWithNewColumns}</div>
          <div className="text-sm text-muted-foreground">Updated Tables</div>
        </div>

        <div className="glass-card rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6 text-secondary" />
          </div>
          <div className="text-2xl font-bold text-secondary">{totalNewColumns}</div>
          <div className="text-sm text-muted-foreground">New Columns</div>
        </div>

        <div className="glass-card rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
          <div className="text-2xl font-bold text-destructive">{tablesWithErrors}</div>
          <div className="text-sm text-muted-foreground">Errors</div>
        </div>
      </div>

      {/* Results Table */}
      <div className="glass-card rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Table className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold">Sync Results</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 font-semibold text-foreground">Table</th>
                <th className="text-left py-4 px-4 font-semibold text-foreground">Column</th>
                <th className="text-left py-4 px-4 font-semibold text-foreground">Description</th>
                <th className="text-left py-4 px-4 font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {results.map((result, index) => {
                if (result.error) {
                  return (
                    <tr key={index} className="smooth-transition hover:bg-muted/20">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <Database className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{result.table}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground italic" colSpan={2}>
                        {result.error}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-destructive">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Error</span>
                        </div>
                      </td>
                    </tr>
                  );
                } else if (!result.newColumns || result.newColumns.length === 0) {
                  return (
                    <tr key={index} className="smooth-transition hover:bg-muted/20">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <Database className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{result.table}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground italic" colSpan={2}>
                        No new columns found
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Up to date</span>
                        </div>
                      </td>
                    </tr>
                  );
                } else {
                  return result.newColumns.map((column, colIndex) => (
                    <tr key={`${index}-${colIndex}`} className="smooth-transition hover:bg-muted/20">
                      <td className="py-4 px-4">
                        {colIndex === 0 ? (
                          <div className="flex items-center gap-3">
                            <Database className="w-4 h-4 text-primary" />
                            <span className="font-medium">{result.table}</span>
                          </div>
                        ) : (
                          <div className="pl-7 flex items-center gap-2">
                            <ChevronRight className="w-3 h-3 text-muted-foreground" />
                            <span className="text-muted-foreground text-sm">{result.table}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-secondary" />
                          <span className="font-mono text-sm bg-muted/30 px-2 py-1 rounded">
                            {column.column}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">
                        {column.description}
                      </td>
                      <td className="py-4 px-4">
                        {colIndex === 0 ? (
                          <div className="flex items-center gap-2 text-success">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {result.newColumns.length} new column{result.newColumns.length > 1 ? 's' : ''}
                            </span>
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">↳ Added</div>
                        )}
                      </td>
                    </tr>
                  ));
                }
              })}
            </tbody>
          </table>
        </div>

        {results.length === 0 && (
          <div className="text-center py-12">
            <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No results yet</h3>
            <p className="text-muted-foreground">Start a sync to see your database schema analysis here.</p>
          </div>
        )}
      </div>
    </div>
  );
};