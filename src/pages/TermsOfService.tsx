import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/Layout';
const TermsOfService = () => {
  const {
    t
  } = useTranslation(['legal']);
  return <Layout>
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:py-24 py-0">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-3xl lg:text-4xl font-serif font-light text-black mb-4">
              {t('legal:termsOfService.title')}
            </h1>
            <p className="text-gray-600 text-lg">
              {t('legal:termsOfService.lastUpdated')}
            </p>
          </div>

          {/* Content */}
          <div className="prose max-w-none">
            {/* Acceptance */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-black mb-6">
                {t('legal:termsOfService.sections.acceptance.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t('legal:termsOfService.sections.acceptance.content')}
              </p>
            </section>

            {/* Products */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-black mb-6">
                {t('legal:termsOfService.sections.products.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t('legal:termsOfService.sections.products.content')}
              </p>
            </section>

            {/* Orders */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-black mb-6">
                {t('legal:termsOfService.sections.orders.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t('legal:termsOfService.sections.orders.content')}
              </p>
            </section>

            {/* Shipping */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-black mb-6">
                {t('legal:termsOfService.sections.shipping.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t('legal:termsOfService.sections.shipping.content')}
              </p>
            </section>

            {/* Returns */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-black mb-6">
                {t('legal:termsOfService.sections.returns.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t('legal:termsOfService.sections.returns.content')}
              </p>
            </section>

            {/* Liability */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-black mb-6">
                {t('legal:termsOfService.sections.liability.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t('legal:termsOfService.sections.liability.content')}
              </p>
            </section>

            {/* Governing Law */}
            <section className="mb-12 bg-gray-50 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-black mb-6">
                {t('legal:termsOfService.sections.governing.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t('legal:termsOfService.sections.governing.content')}
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>;
};
export default TermsOfService;