import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/Layout';

const PrivacyPolicy = () => {
  const { t } = useTranslation(['legal']);

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-6 py-16 lg:py-24">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-3xl lg:text-4xl font-serif font-light text-black mb-4">
              {t('legal:privacyPolicy.title')}
            </h1>
            <p className="text-gray-600 text-lg">
              {t('legal:privacyPolicy.lastUpdated')}
            </p>
          </div>

          {/* Content */}
          <div className="prose max-w-none">
            {/* Introduction */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-black mb-6">
                {t('legal:privacyPolicy.sections.intro.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t('legal:privacyPolicy.sections.intro.content')}
              </p>
            </section>

            {/* Data Collection */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-black mb-6">
                {t('legal:privacyPolicy.sections.dataCollection.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t('legal:privacyPolicy.sections.dataCollection.content')}
              </p>
            </section>

            {/* Data Use */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-black mb-6">
                {t('legal:privacyPolicy.sections.dataUse.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t('legal:privacyPolicy.sections.dataUse.content')}
              </p>
            </section>

            {/* Data Sharing */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-black mb-6">
                {t('legal:privacyPolicy.sections.dataSharing.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t('legal:privacyPolicy.sections.dataSharing.content')}
              </p>
            </section>

            {/* Security */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-black mb-6">
                {t('legal:privacyPolicy.sections.security.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t('legal:privacyPolicy.sections.security.content')}
              </p>
            </section>

            {/* Rights */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-black mb-6">
                {t('legal:privacyPolicy.sections.rights.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t('legal:privacyPolicy.sections.rights.content')}
              </p>
            </section>

            {/* Contact */}
            <section className="mb-12 bg-gray-50 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-black mb-6">
                {t('legal:privacyPolicy.sections.contact.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t('legal:privacyPolicy.sections.contact.content')}
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;