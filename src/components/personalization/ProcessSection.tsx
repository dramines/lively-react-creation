const ProcessSection = () => {
  return (
    <div id="products-section" className="max-w-7xl mx-auto -mt-12 px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all animate-fade-in">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-primary text-2xl font-bold mb-6">
            1
          </div>
          <h3 className="text-xl font-semibold mb-4">Choix des vêtements</h3>
          <p className="text-gray-600">Sélectionnez parmi notre large gamme de produits personnalisables</p>
        </div>
        <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all animate-fade-in-delayed">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-primary text-2xl font-bold mb-6">
            2
          </div>
          <h3 className="text-xl font-semibold mb-4">Personnalisation</h3>
          <p className="text-gray-600">Créez votre design unique avec notre outil intuitif</p>
        </div>
        <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all animate-fade-in-delayed">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-primary text-2xl font-bold mb-6">
            3
          </div>
          <h3 className="text-xl font-semibold mb-4">Devis rapide</h3>
          <p className="text-gray-600">Recevez votre devis personnalisé sous 48h</p>
        </div>
      </div>
    </div>
  );
};

export default ProcessSection;