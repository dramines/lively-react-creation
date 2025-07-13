-- SQL to insert a sample costume product for testing
-- This will create a product in the "surMesure > homme > costume" category

INSERT INTO products (
    reference_product,
    nom_product,
    img_product,
    img2_product,
    img3_product,
    img4_product,
    description_product,
    type_product,
    category_product,
    itemgroup_product,
    price_product,
    qnty_product,
    color_product,
    status_product,
    discount_product,
    createdate_product,
    -- Size fields
    xs_size,
    s_size,
    m_size,
    l_size,
    xl_size,
    xxl_size,
    3xl_size,
    4xl_size,
    48_size,
    50_size,
    52_size,
    54_size,
    56_size,
    58_size
) VALUES (
    'COSTUME-HOMME-001',
    'Costume Classique Homme en Laine',
    'costume-homme-classic.jpg',
    'costume-homme-classic-back.jpg',
    'costume-homme-classic-detail.jpg',
    NULL,
    '<p>Costume élégant pour homme, confectionné dans une laine de haute qualité.</p><p><strong>Caractéristiques :</strong></p><ul><li>Tissu : 100% laine vierge</li><li>Coupe classique</li><li>Doublure en soie</li><li>Boutons en nacre véritable</li><li>Fabrication sur mesure</li></ul><p>Parfait pour les occasions formelles et professionnelles.</p>',
    'surMesure',
    'homme',
    'costume',
    1200.00,
    5,
    'Bleu Marine',
    'active',
    0,
    NOW(),
    -- Size quantities (European sizes)
    0,  -- xs_size
    0,  -- s_size
    0,  -- m_size
    0,  -- l_size
    0,  -- xl_size
    0,  -- xxl_size
    0,  -- 3xl_size
    0,  -- 4xl_size
    2,  -- 48_size (1 piece available)
    2,  -- 50_size (2 pieces available)
    1,  -- 52_size (1 piece available)
    1,  -- 54_size (1 piece available)
    0,  -- 56_size
    0   -- 58_size
);

-- Add another variant in charcoal gray
INSERT INTO products (
    reference_product,
    nom_product,
    img_product,
    img2_product,
    description_product,
    type_product,
    category_product,
    itemgroup_product,
    price_product,
    qnty_product,
    color_product,
    status_product,
    discount_product,
    createdate_product,
    48_size,
    50_size,
    52_size,
    54_size,
    56_size
) VALUES (
    'COSTUME-HOMME-002',
    'Costume Premium Homme en Cachemire',
    'costume-homme-premium.jpg',
    'costume-homme-premium-detail.jpg',
    '<p>Costume premium pour homme en mélange cachemire et laine.</p><p><strong>Caractéristiques :</strong></p><ul><li>Tissu : 70% laine, 30% cachemire</li><li>Coupe moderne ajustée</li><li>Doublure en soie</li><li>Finitions main</li><li>Fabrication sur mesure exclusive</li></ul>',
    'surMesure',
    'homme',
    'costume',
    1850.00,
    3,
    'Gris Anthracite',
    'active',
    0,
    NOW(),
    1,  -- 48_size
    1,  -- 50_size
    1,  -- 52_size
    0,  -- 54_size
    0   -- 56_size
);