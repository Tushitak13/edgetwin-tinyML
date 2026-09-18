import React from 'react';
import { TopHeader } from '../components/navigation/TopHeader';
import { Sidebar } from '../components/navigation/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  scenarioActive?: boolean;
  onToggleScenario?: () => void;
  dataSource?: 'hardware' | 'simulation';
  onToggleDataSource?: (source: 'hardware' | 'simulation') => void;
  syncSeconds?: number;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  scenarioActive,
  onToggleScenario,
  dataSource,
  onToggleDataSource,
  syncSeconds = 2,
}) => {
  return (
    <div className="bg-eng-grid text-coffee min-h-screen font-sans flex flex-col antialiased selection:bg-butter selection:text-coffee-deep">
      <TopHeader
        scenarioActive={scenarioActive}
        onToggleScenario={onToggleScenario}
        dataSource={dataSource}
        onToggleDataSource={onToggleDataSource}
        syncSeconds={syncSeconds}
      />
      <div className="flex-1 flex max-w-[1680px] w-full mx-auto p-4 md:p-6 gap-6">
        <Sidebar />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
};
