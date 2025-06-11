
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-8 text-center">
            Politique de confidentialité
          </h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-sm text-slate-600 mb-8">
              <strong>Dernière mise à jour :</strong> 25 février 2025
            </p>

            <div className="space-y-8">
              <section>
                <p className="text-slate-700 leading-relaxed">
                  Cette politique de confidentialité explique comment Mylittlehero (le « Site », « nous », « notre » ou « nos ») collecte, utilise et divulgue vos informations personnelles lorsque vous visitez, utilisez nos services ou effectuez un achat sur www.mylittlehero.co (le « Site ») ou communiquez autrement avec nous au sujet du Site (conjointement, les « Services »). Aux fins de la présente politique de confidentialité, « vous », « votre » et « vos » vous désignent en tant qu'utilisateur des Services, que vous soyez un client, un visiteur du site web ou une autre personne dont nous avons collecté les informations conformément à la présente politique de confidentialité.
                </p>
                <p className="text-slate-700 leading-relaxed font-semibold mt-4">
                  Veuillez lire attentivement la présente politique de confidentialité.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Modifications de la présente politique de confidentialité</h2>
                <p className="text-slate-700 leading-relaxed">
                  Nous pouvons mettre à jour la présente politique de confidentialité de temps à autre, notamment pour refléter les changements apportés à nos pratiques ou pour d'autres raisons opérationnelles, juridiques ou réglementaires. Nous publierons la politique de confidentialité révisée sur le Site, actualiserons la date de « Dernière mise à jour » et prendrons toute autre mesure requise par la législation en vigueur.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Comment nous collectons et utilisons vos informations personnelles</h2>
                <p className="text-slate-700 leading-relaxed">
                  Pour fournir les Services, nous collectons et avons collecté au cours des 12 derniers mois des informations personnelles vous concernant issues de diverses sources, comme indiqué ci-dessous. Les informations que nous collectons et utilisons varient en fonction de la manière dont vous interagissez avec nous.
                </p>
                <p className="text-slate-700 leading-relaxed mt-4">
                  En plus des utilisations spécifiques exposées ci-dessous, nous pouvons utiliser les informations que nous collectons à votre sujet pour communiquer avec vous, fournir ou améliorer les Services, nous conformer à toute obligation légale applicable, faire respecter les conditions de service applicables et protéger ou défendre les Services, nos droits et les droits de nos utilisateurs ou autres.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Informations personnelles que nous collectons</h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Les types d'informations personnelles que nous obtenons à votre sujet dépendent de la manière dont vous interagissez avec notre Site et utilisez nos Services. Lorsque nous utilisons le terme « informations personnelles », nous faisons référence aux informations qui vous identifient, vous concernent, vous décrivent ou peuvent être associées à vous. Les sections suivantes décrivent les catégories et les types spécifiques d'informations personnelles que nous collectons.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Informations que nous collectons directement auprès de vous</h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Les informations que vous nous soumettez directement via nos Services peuvent inclure :
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>Des coordonnées notamment votre nom, adresse, numéro de téléphone, et e-mail.</li>
                  <li>Des informations de commande notamment votre nom, votre adresse de facturation, votre adresse d'expédition, votre confirmation de paiement, votre e-mail et numéro de téléphone.</li>
                  <li>Des informations du compte notamment votre nom d'utilisateur, votre mot de passe, vos questions de sécurité et d'autres informations utilisées à des fins de sécurité du compte.</li>
                </ul>
              </section>

              <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-400 mt-8">
                <p className="text-slate-700 leading-relaxed">
                  Pour toute question concernant notre politique de confidentialité, veuillez nous contacter à l'adresse suivante :
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

export default PrivacyPolicy;
