import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/Layout';
const CookiePolicy = () => {
  const {
    t
  } = useTranslation(['legal']);
  return <Layout>
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:py-24 py-0">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-3xl lg:text-4xl font-serif font-light text-black mb-4">
              {t('legal:cookiePolicy.title')}
            </h1>
            <p className="text-gray-600 text-lg">
              {t('legal:cookiePolicy.lastUpdated')}
            </p>
          </div>

          {/* Content */}
          <div className="prose max-w-none">
            {/* Introduction */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-black mb-6">
                {t('legal:cookiePolicy.sections.intro.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t('legal:cookiePolicy.sections.intro.content')}
              </p>
            </section>

            {/* Types */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-black mb-6">
                {t('legal:cookiePolicy.sections.types.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t('legal:cookiePolicy.sections.types.content')}
              </p>
            </section>

            {/* Essential */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-black mb-6">
                {t('legal:cookiePolicy.sections.essential.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t('legal:cookiePolicy.sections.essential.content')}
              </p>
            </section>

            {/* Analytics */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-black mb-6">
                {t('legal:cookiePolicy.sections.analytics.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t('legal:cookiePolicy.sections.analytics.content')}
              </p>
            </section>

            {/* Marketing */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-black mb-6">
                {t('legal:cookiePolicy.sections.marketing.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t('legal:cookiePolicy.sections.marketing.content')}
              </p>
            </section>

            {/* Control */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-black mb-6">
                {t('legal:cookiePolicy.sections.control.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t('legal:cookiePolicy.sections.control.content')}
              </p>
            </section>

            {/* Third Party */}
            <section className="mb-12 bg-gray-50 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-black mb-6">
                {t('legal:cookiePolicy.sections.thirdParty.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t('legal:cookiePolicy.sections.thirdParty.content')}
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>;
};
export default CookiePolicy;