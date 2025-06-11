
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-8 text-center">
            POLITIQUE DE REMBOURSEMENT – MYLITTLEHERO
          </h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-sm text-slate-600 mb-8">
              <strong>Dernière mise à jour :</strong> 16 février 2025
            </p>

            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-4">1. Objet</h2>
                <p className="text-slate-700 leading-relaxed">
                  La présente Politique de Remboursement a pour objet de définir les conditions et modalités selon lesquelles un remboursement pourra être effectué pour les produits achetés sur le site mylittlehero.co. Il est expressément convenu qu'un remboursement ne pourra être accordé qu'en cas de produit endommagé ou présentant un défaut de fabrication imputable à une erreur ou à un manquement de la part de MyLittleHero.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-4">2. Champ d'application</h2>
                <p className="text-slate-700 leading-relaxed">
                  Cette politique s'applique exclusivement aux réclamations relatives à un produit présentant un dommage ou un défaut de fabrication dû à une intervention ou une négligence de MyLittleHero. Toute autre demande, notamment liée à un changement d'avis ou à une erreur de personnalisation non imputable à MyLittleHero, ne pourra donner lieu à un remboursement.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-4">3. Conditions d'éligibilité au remboursement</h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Pour qu'un remboursement puisse être envisagé, il est impératif que :
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>Le produit présente un dommage ou un défaut de fabrication clairement démontré et imputable à une erreur de MyLittleHero.</li>
                  <li>Le client fournisse des preuves tangibles (photographies et/ou toute autre documentation pertinente) attestant de l'endommagement du produit.</li>
                  <li>La demande de remboursement soit formulée dans un délai de 7 jours à compter de la réception du produit.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-4">4. Procédure de demande</h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Le client souhaitant obtenir un remboursement doit :
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>Contacter notre service clientèle à l'adresse suivante : <a href="mailto:Mylittleheroteam@gmail.com" className="text-orange-600 hover:text-orange-700 underline">Mylittleheroteam@gmail.com</a> en mentionnant son numéro de commande et en exposant les circonstances du dommage constaté.</li>
                  <li>Joindre à sa demande les preuves nécessaires (photographies, descriptions détaillées, etc.) démontrant que le produit a été endommagé du fait de MyLittleHero.</li>
                  <li>Attendre la confirmation de réception de sa demande et le résultat de l'évaluation de son dossier par notre équipe.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-4">5. Modalités du remboursement</h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                  En cas de reconnaissance du dommage ou du défaut de fabrication imputable à MyLittleHero, le remboursement sera :
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>Effectué par le même mode de paiement utilisé lors de l'achat.</li>
                  <li>D'un montant correspondant strictement au prix d'achat du produit.</li>
                  <li>Les frais de livraison ne seront remboursés qu'en cas de dommage clairement imputable à une erreur de MyLittleHero.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-4">6. Exclusions</h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Aucun remboursement ne pourra être accordé dans les cas suivants :
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>Le produit a été endommagé ou altéré suite à une utilisation inappropriée ou non conforme aux instructions communiquées par MyLittleHero.</li>
                  <li>La demande de remboursement est effectuée en dehors du délai de 7 jours suivant la réception du produit.</li>
                  <li>Les réclamations ne reposant pas sur des preuves démontrant un défaut ou un dommage imputable à MyLittleHero.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-4">7. Modifications de la Politique de Remboursement</h2>
                <p className="text-slate-700 leading-relaxed">
                  MyLittleHero se réserve le droit de modifier la présente Politique de Remboursement à tout moment. Les modifications seront publiées sur le site mylittlehero.co et la date de « Dernière mise à jour » sera actualisée en conséquence.
                </p>
              </section>

              <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-400 mt-8">
                <p className="text-slate-700 leading-relaxed mb-4">
                  En utilisant nos Services, vous acceptez les termes de la présente Politique de Remboursement.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  Pour toute question ou demande d'information complémentaire, veuillez nous contacter à l'adresse suivante :
                  <br />
                  <a href="mailto:Mylittleheroteam@gmail.com" className="text-orange-600 hover:text-orange-700 underline font-semibold">
                    Mylittleheroteam@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default RefundPolicy;
