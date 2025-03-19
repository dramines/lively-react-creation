
import { ReactNode } from 'react';

type TabType = 'apercu' | 'projets' | 'documents';

interface ArtistNavTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const ArtistNavTabs = ({ activeTab, setActiveTab }: ArtistNavTabsProps) => {
  return (
    <div className="flex border-b border-gray-700">
      <TabButton 
        isActive={activeTab === 'apercu'} 
        onClick={() => setActiveTab('apercu')}
      >
        Aperçu
      </TabButton>
      <TabButton 
        isActive={activeTab === 'projets'} 
        onClick={() => setActiveTab('projets')}
      >
        Projets
      </TabButton>
      <TabButton 
        isActive={activeTab === 'documents'} 
        onClick={() => setActiveTab('documents')}
      >
        Documents
      </TabButton>
    </div>
  );
};

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: ReactNode;
}

const TabButton = ({ isActive, onClick, children }: TabButtonProps) => (
  <button
    className={`px-6 py-3 font-medium transition-colors ${
      isActive
        ? 'text-gold-400 border-b-2 border-gold-400'
        : 'text-gray-400 hover:text-white'
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

export default ArtistNavTabs;
