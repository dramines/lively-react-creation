import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/Layout';
const Accessibility = () => {
  const {
    t
  } = useTranslation(['legal']);
  return <Layout>
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:py-24 py-0">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-3xl lg:text-4xl font-serif font-light text-black mb-4">
              {t('legal:accessibility.title')}
            </h1>
            <p className="text-gray-600 text-lg">
              {t('legal:accessibility.lastUpdated')}
            </p>
          </div>

          {/* Content */}
          <div className="prose max-w-none">
            {/* Commitment */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-black mb-6">
                {t('legal:accessibility.sections.commitment.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t('legal:accessibility.sections.commitment.content')}
              </p>
            </section>

            {/* Standards */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-black mb-6">
                {t('legal:accessibility.sections.standards.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t('legal:accessibility.sections.standards.content')}
              </p>
            </section>

            {/* Features */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-black mb-6">
                {t('legal:accessibility.sections.features.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t('legal:accessibility.sections.features.content')}
              </p>
            </section>

            {/* Assistance */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-black mb-6">
                {t('legal:accessibility.sections.assistance.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t('legal:accessibility.sections.assistance.content')}
              </p>
            </section>

            {/* Feedback */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-black mb-6">
                {t('legal:accessibility.sections.feedback.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t('legal:accessibility.sections.feedback.content')}
              </p>
            </section>

            {/* Contact */}
            <section className="mb-12 bg-gray-50 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-black mb-6">
                {t('legal:accessibility.sections.contact.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t('legal:accessibility.sections.contact.content')}
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>;
};
export default Accessibility;